import { createReadStream } from "node:fs";
import { Options as ParseCsvOptions, parse as parseCsv } from "csv-parse";
import { Record } from "../models/record";
import { tick } from "./performance";

export type ProcessCsvFileOptions<T> = {
  parseOptions?: ParseCsvOptions | undefined | null,      // 
  limit?: bigint | undefined | null;                      // cap the number of records in the iteration (inclusive)
  callback?:                                              // the fn to run on each record in the iteration
    | ((record: T, index: bigint) => Promise<void>)
    | ((record: T) => void)
    | undefined
    | null;
};

/**
 * Creates a stream to iterate over each record in the CSV file.
 * 
 * @param filepath - the path of the CSV file to parse and stream records
 * @param options - options
 */
export async function processCsvFile(
  filepath: string,
  options: ProcessCsvFileOptions<Record>,
) {
  console.log("Started...");
  const tock = tick();
  // set up read pipeline
  const parser = createReadStream(filepath).pipe(
    parseCsv(options.parseOptions ?? undefined),
  );
  // start streaming
  let count: bigint = 0n;
  for await (const rawRecord of parser) {
    if (options.limit && count === options.limit) break;
    count++;
    // parse record
    const rec = Record.parse(rawRecord);
    // execute callback if specified
    if (options.callback) {
      await options.callback(rec, count - 1n);
    }
  }
  // wrap up
  tock();
  console.log(`Processed ${count.toLocaleString()} record(s).`);
}
