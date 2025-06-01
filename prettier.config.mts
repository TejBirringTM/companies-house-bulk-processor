import { type Config } from "prettier";

export default {
    singleQuote: false,
    semi: true,
    tabWidth: 4,
    trailingComma: "es5",
    overrides: [
        {
            files: "**/*.md",
            options: {
                tabWidth: 2,
            },
        },
    ],
} satisfies Config;
