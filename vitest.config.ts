import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { defineConfig } from "vitest/config"

const manifest = JSON.parse(readFileSync(resolve("package.json"), "utf8"))
const browser = Boolean(manifest.devDependencies?.jsdom)

export default defineConfig({
    resolve: {
        alias: { "@": resolve("src") },
    },
    test: {
        name: manifest.name,
        environment: browser ? "jsdom" : "node",
        include: ["tests/**/*.test.{ts,tsx}"],
        setupFiles: browser ? [fileURLToPath(new URL("./tests/setup.ts", import.meta.url))] : [],
        maxWorkers: 2,
        restoreMocks: true,
        coverage: {
            provider: "v8",
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["src/**/*.d.ts", "src/generated/**"],
            reporter: ["text", "json-summary", "html"],
            reportsDirectory: "coverage",
        },
    },
})
