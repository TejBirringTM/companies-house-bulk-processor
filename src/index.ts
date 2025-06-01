import "dotenv/config";
import { parseConfig } from "./parse-config";
import { Record } from "./models/record";
import { processCsvFile } from "./libs/csv";
import { ArangoBatchClient } from "./libs/clients/arango";
import { debugOnly } from "./libs/debug";
import { logMemoryUsage } from "./libs/performance";

async function main() {
    // parse config
    const config = await parseConfig();
    console.log("Running with arguments:\n", config);

    if (config.destination.type === "googleBigQuery") {
        throw new Error(
            `Destination type not yet supported: ${config.destination.type}`
        );
    }

    // create db client for upload
    const client = new ArangoBatchClient<Record & { _key: string }>({
        url: config.destination.url,
        databaseName: config.destination.databaseName,
        collectionName: config.destination.collectionName,
        auth: {
            username: config.destination.auth.username,
            password: config.destination.auth.password,
        },
        batchSize: config.options.batchSize,
    });

    // start processing the CSV file
    await processCsvFile(config.source.filepath, {
        parseOptions: {
            delimiter: ",",
            columns: true,
            trim: true,
        },
        limit: 10_000n, // must always be in bigint format
        async callback(record, count) {
            // *** implement filter here if required, e.g: ***
            if (record.status.toLowerCase().includes("active")) {
                // ** enqueue for insertion **
                await client.enqueue({
                    _key: record.number, // this is used internally as document identifier within the ArangoDB collection
                    ...record,
                });
                debugOnly(() => {
                    console.debug(`Record # ${count} enqueued:`, record);
                    logMemoryUsage();
                });
            }
        },
    });

    // wait for db client to finish
    await client.finalise();

    // exit
    process.exit(0);
}

main();
