import { readdir, writeFile } from "fs/promises"

async function main() {
    const dir = await readdir("src/components")
    await writeFile(
        "src/index.tsx",
        `${dir.map(file => `export * from "./components/${file.replace(/\.tsx$/, "")}"`).join("\n")}
`,
        "utf-8"
    )
}

main()
