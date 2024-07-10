import { getExports } from "../../../utils/getExports"
import { writeCode } from "../../../utils/writeCode"

async function main() {
    const exports = await getExports()
    await writeCode("src/index.ts", exports.join("\n"))
}

main()
