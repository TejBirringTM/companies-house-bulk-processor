import { z } from "zod";
import { filepath } from "../libs/fs";

const MIN_BATCH_SIZE = 100; // 100 records
// const MIN_FLUSH_INTERVAL = 500; // 0.5 seconds

const Filepath = z
  .string()
  .nonempty()
  .refine(async (str) => {
    return await filepath(str, true);
  });

const ProcessingOptions = z.object({
  batchSize: z.number().gte(MIN_BATCH_SIZE), // flush every N records
  // flushIntervalMs: z.number().gte(MIN_FLUSH_INTERVAL), // or after M milliseconds (whichever comes first)
});

const ConfigArangoDB = z.object({
  type: z.literal("arangoDB"),
  url: z.string().url(),
  databaseName: z.string().nonempty(),
  collectionName: z.string().nonempty(),
  auth: z.object({
    username: z.string().nonempty(),
    password: z.string().nonempty()
  })
});

const ConfigGoogleBigQuery = z.object({
  type: z.literal("googleBigQuery"),
  projectId: z.string().nonempty(),
  datasetId: z.string().nonempty(),
  tableId: z.string().nonempty(),
  serviceKeyFilepath: Filepath,
});

export const JsonConfig = z.object({
  source: z.object({
    type: z.literal("csvFile"),
    name: z.string().nonempty(),
    description: z.string().nullable(),
    filepath: Filepath,
  }),
  destination: z.discriminatedUnion("type", [
    ConfigArangoDB,
    ConfigGoogleBigQuery
  ]),
  options: ProcessingOptions,
});

export type JsonConfig = z.infer<typeof JsonConfig>;
