import { Database } from "arangojs";
import { ConfigOptions } from "arangojs/configuration";
import { debug } from "../../debug";

const MAX_N_BATCH_JOBS = 10;

type ArangoBatchClientOptions = Omit<ConfigOptions, "databaseName"> & {
    databaseName: string,
    collectionName: string, 
    batchSize: number, // the number of records to store in memory before queuing the batch for DB write
    // flushIntervalMs: number
};

export class ArangoBatchClient<T> {
    private readonly options: ArangoBatchClientOptions
    private readonly client: Database;
    
    private currentBatch: T[];
    private batchJobs: Promise<void>[];

    private initialised: boolean;

    constructor(options: ArangoBatchClientOptions) {
        this.initialised = false;
        // persist options
        this.options = options;
        // create client on default DB
        const clientOptions : ConfigOptions = {...options};
        delete clientOptions.databaseName;
        this.client = new Database(clientOptions);
        // initialise batch proc
        this.currentBatch = [];
        this.batchJobs = [];
    }

    private async initialise() {
        if (this.initialised) {
            return;
        }
        // ensure db is always fresh
        const dbs = await this.client.listUserDatabases();
        if (!dbs.includes(this.options.databaseName)) {
            await this.client.createDatabase(this.options.databaseName);
            debug(`Database created: ${this.options.databaseName}`);
        } else {
            debug(`Database already exists: ${this.options.databaseName}`);
            debug(`Erasing database...`);
            await this.client.dropDatabase(this.options.databaseName);
            await this.client.createDatabase(this.options.databaseName);
        }
        // create collection
        await this.client.database(this.options.databaseName).createCollection(this.options.collectionName);
        debug(`Collection created: ${this.options.databaseName} -> ${this.options.collectionName}`);
        // set
        this.initialised = true;
        debug("ArangoClient initialised.");
    }

    async flush() {
        await this.initialise();

        // create batch job
        const batchJob = async () => {
            await this.client.database(this.options.databaseName).collection(this.options.collectionName).saveAll([
                ...this.currentBatch
            ]);
        };
        this.batchJobs.push(batchJob());
        
        // reset current batch
        this.currentBatch = [];

        // if too many jobs, make sure they finish before continuing ops
        if (this.batchJobs.length >= MAX_N_BATCH_JOBS) {
            process.nextTick(async ()=>{
                debug("Jobs queue is full, waiting for jobs to complete...");
                await Promise.all(this.batchJobs);
                this.batchJobs = [];
                // debug("Jobs queue is empty.");
            });
        }
    }

    async finalise() {
        await this.flush();
        await Promise.all(this.batchJobs);
        this.batchJobs = [];
        debug("Done!");
    }

    async enqueue(record: T) {
        await this.initialise();

        if (this.currentBatch.length >= this.options.batchSize) {
            debug("Batch size reached, flushing to DB...");
            await this.flush();
        }

        this.currentBatch.push(record);
        // debug(`Record enqueued (${this.currentBatch.length}/${this.options.batchSize}):`, record);
    }
}