import { getExports, writeCode } from "@1adybug/build-config/exports"

async function main() {
    const exports = await getExports()
    await writeCode("src/index.ts", exports.join("\n"))
}

await main()
