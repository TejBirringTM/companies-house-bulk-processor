[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-007acc)](https://www.typescriptlang.org/)
[![Node.js Version](https://img.shields.io/badge/Node-%3E%3D23-336633)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-darkred.svg)](https://opensource.org/licenses/MIT)
[![Open Issues](https://img.shields.io/github/issues-raw/TejBirringTM/companies-house-bulk-processor)](https://github.com/TejBirringTM/companies-house-bulk-processor/issues)
[![Last Commit](https://img.shields.io/github/last-commit/TejBirringTM/companies-house-bulk-processor)](https://github.com/TejBirringTM/companies-house-bulk-processor/commits/main)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

# Companies House UK Bulk Data Processor

A Node.js script for processing bulk data obtained from Companies House UK in CSV format. Useful for normalising, filtering, and uploading to databases such as ArangoDB or Google BigQuery.

Provides a solid foundation for company analysis projects (e.g., augmenting company information with web scraping) for market research purposes. Can be further enhanced with AI interface (e.g., LLM interface, MCP server to power agents, and more).

## Features

- Designed for bulk operations on Companies House datasets (CSV files)

  - CSV data processing and normalisation

- Custom filtering and transformation capabilities

- Database integration (ArangoDB, Google BigQuery) for efficient batch inserts

- **Coming Soon:** Extensible architecture for additional processing steps

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/yourusername/companies-house-processor.git
    cd companies-house-processor
    ```

2. Install project dependencies.
  
    ```bash
    npm install
    ```

3. Configure your environment by copying the example env file:

    ```bash
      cp .env.example .env
    ```

## Usage

1. **(Optional)** Place your Companies House CSV files in the `input` directory.

2. Configure your processing parameters in `config.ts`.

3. Ensure `.env` file is correct, according to processing parameters in `config.ts`.

4. Run the processor.

    ```bash
      npm start
    ```

## Data Flow

See `processCsvFile(...)` function call in `main()` function body (`src/index.ts`):

1. The database client is initialised.

2. A read stream is opened to the input CSV file whose path is specified in `config.ts`.

3. The CSV file is traversed to parse records according to the `Record` schema (`src/models/record.ts`).

4. The callback is executed for the record — which contains logic for any filtering, transformation, and enqueuing for database insertion.

5. After all records have been processed, the database client is flushed.

## Contribution

**Pull requests are welcome!**

For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE.md)
