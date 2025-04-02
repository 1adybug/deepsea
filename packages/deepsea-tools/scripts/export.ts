import { getExports } from "../../../utils/getExports"
import { writeCode } from "../../../utils/writeCode"

async function main() {
    const exports = await getExports()
    exports.push(`export { default as equal } from "fast-deep-equal"`)
    exports.push(`export * from "soda-type"`)
    await writeCode("src/index.ts", exports.join("\n"))
}

main()
