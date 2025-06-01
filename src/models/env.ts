import { z } from "zod";

const envVarOptionsMap = {
    string: (key: Uppercase<string>) => z.string({message: `The environment variable ${key} is required!`}).nonempty().parse(process.env[key])
} as const;

type EnvVarOptionsMap = typeof envVarOptionsMap;
type EnvVarOptions = keyof EnvVarOptionsMap;
type EnvVarOptionArgs<T> = T extends EnvVarOptions ? Parameters<EnvVarOptionsMap[T]> : never;
type EnvVarOptionReturnType<T> = T extends EnvVarOptions ? ReturnType<EnvVarOptionsMap[T]> : never;

export const getEnvVar = <T extends EnvVarOptions>(type: EnvVarOptions, ...args: EnvVarOptionArgs<T>) => (envVarOptionsMap[type] as (...args: any[])=>EnvVarOptionReturnType<T>)(...args);


