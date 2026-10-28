import { getExports, writeCode } from "@1adybug/build-config/exports"

async function main() {
    const exports = await getExports()
    exports.push(`export { default as equal } from "fast-deep-equal"`)
    exports.push(`export * from "@1adybug/types"`)
    await writeCode("src/index.ts", exports.join("\n"))
}

await main()
