import { defineConfig } from "@rslib/core"

export default defineConfig({
    source: {
        entry: {
            index: ["./src/**"],
        },
    },
    lib: [
        {
            bundle: false,
            dts: true,
            format: "esm",
        },
        {
            bundle: false,
            dts: true,
            format: "cjs",
        },
    ],
    output: {
        target: "web",
    },
})
