import { defineConfig } from "@1adybug/eslint"

const files = "**/*.{js,mjs,ts,tsx}"

const browserPackages = [
    "deepsea-components",
    "playground",
    "react-soda",
    "soda-antd",
    "soda-heroui",
    "soda-hooks",
    "soda-next",
    "soda-react",
    "soda-react-router",
    "soda-tanstack-form",
    "soda-tanstack-query",
]

const nodePackages = ["sdnext", "sdrr", "soda-nodejs", "soda-tailwind"]

const mixedPackages = ["deepsea-tools", "soda-array", "soda-coordinate", "soda-type"]

const outOfProjectFiles = [
    "utils/**/*.ts",
    "packages/*/rslib.config.ts",
    "packages/*/rsbuild.config.ts",
    "packages/*/tailwind.config.ts",
    "packages/*/scripts/**/*.ts",
]

export default [
    ...defineConfig({
        next: false,
        react: true,
        node: {
            enabled: true,
            preset: "module",
            version: ">=24.0.0",
            rules: {
                "n/hashbang": "off",
                "n/no-process-exit": "off",
                "n/no-unpublished-import": "off",
            },
        },
        directories: {
            web: browserPackages.map(name => `packages/${name}/src/${files}`),
            node: [
                `*.config.mjs`,
                `scripts/${files}`,
                ...nodePackages.map(name => `packages/${name}/src/${files}`),
                ...outOfProjectFiles,
                "packages/playground/postcss.config.mjs",
            ],
            mixed: [...mixedPackages.map(name => `packages/${name}/src/${files}`), "packages/*/types.d.ts"],
        },
        ignores: ["**/dist/**", "**/compiled/**", "**/coverage/**", "**/.next/**", "**/public/**"],
        rules: {
            "@typescript-eslint/no-unsafe-function-type": "off",
        },
    }),
    {
        files: outOfProjectFiles,
        languageOptions: {
            parserOptions: {
                projectService: false,
            },
        },
        rules: {
            "@typescript-eslint/no-deprecated": "off",
        },
    },
]
