import { defineConfig } from "@1adybug/eslint"

const files = "**/*.{js,mjs,ts,tsx}"

const browserPackages = ["components", "store", "antd", "heroui", "hooks", "next", "react", "react-router", "tanstack-form", "tanstack-query"]

const nodePackages = ["next-cli", "react-router-cli", "node", "tailwind"]

const mixedPackages = ["tools", "array", "coordinate", "types"]

const outOfProjectFiles = [
    "packages/*/rslib.config.ts",
    "packages/*/scripts/**/*.ts",
    "apps/*/*.config.ts",
    "packages/*/tests/**/*.{ts,tsx}",
    "apps/*/tests/**/*.{ts,tsx}",
    "tests/**/*.ts",
    "compat/*/tests/**/*.ts",
    "vitest.config.ts",
]

export default [
    {
        settings: {
            "react-hooks": {
                additionalEffectHooks: "^useStableEffect$",
            },
        },
    },
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
            web: [...browserPackages.map(name => `packages/${name}/src/${files}`), `apps/*/src/${files}`],
            node: [
                `*.config.mjs`,
                `scripts/${files}`,
                `tooling/${files}`,
                `tooling/**/${files}`,
                `tests/${files}`,
                ...nodePackages.map(name => `packages/${name}/src/${files}`),
                ...outOfProjectFiles,
                "apps/*/postcss.config.mjs",
            ],
            mixed: [...mixedPackages.map(name => `packages/${name}/src/${files}`), "packages/*/types.d.ts"],
        },
        ignores: ["**/dist/**", "**/compiled/**", "**/coverage/**", "**/.next/**", "**/public/**", "**/.turbo/**", "**/.artifacts/**", "packages/xlsx/**"],
        rules: {
            "@typescript-eslint/no-unsafe-function-type": "off",
            "@typescript-eslint/consistent-type-definitions": "off",
            "@typescript-eslint/naming-convention": "off",
            "prefer-const": "off",
            "prefer-template": "off",
            "prefer-arrow-callback": "off",
            "react/self-closing-comp": "off",
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
    {
        files: ["packages/*/tests/**/*.{ts,tsx}", "apps/*/tests/**/*.{ts,tsx}"],
        rules: {
            "no-restricted-syntax": "off",
        },
    },
    {
        rules: {
            "react/self-closing-comp": "off",
        },
    },
]
