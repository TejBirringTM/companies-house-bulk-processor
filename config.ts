import { JsonConfig } from "./src/models/config";
import { getEnvVar } from "./src/models/env";

export default {
  source: {
    type: "csvFile",
    name: "Companies House UK: Basic Company Data: 2025-05-01",
    description: null,
    filepath: "./basic-company-data-as-one-file-2025-05-01.csv",
  },
  destination: {
    type: "arangoDB",
    url: "http://localhost:8529",
    databaseName: "companies-house-uk",
    collectionName: "companies-2025-05-01",
    auth: {
      username: getEnvVar("string", "ARANGO_USER"),
      password: getEnvVar("string", "ARANGO_PWD")
    }
  },
  options: {
    batchSize: 100,
    // flushIntervalMs: 10_000,
  },
} satisfies JsonConfig;
