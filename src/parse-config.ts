import { JsonConfig } from "./models/config";
import config from "../config";
import { z } from "zod";

export async function parseConfig() {
    const parsedConfig = await JsonConfig.parseAsync(config);
    const sourceFilename = (() => {
        const segments = config.source.filepath.split("/");
        return z
            .string()
            .nonempty()
            .parse(segments[segments.length - 1]);
    })();
    return {
        destination: parsedConfig.destination,
        source: {
            ...parsedConfig.source,
            filename: sourceFilename,
        },
        options: parsedConfig.options,
    };
}

export type ParsedConfig = Awaited<ReturnType<typeof parseConfig>>;
