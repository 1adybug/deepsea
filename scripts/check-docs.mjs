import { access, readFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"

import { readWorkspacePackages } from "./workspace.mjs"

const packages = [...(await readWorkspacePackages()).values()]

const directories = [".", ...packages.map(item => item.directory)]

const errors = []

for (const directory of directories) {
    for (const name of ["README.md", "README.zh-CN.md"]) {
        const path = resolve(directory, name)
        let content

        try {
            content = await readFile(path, "utf8")
        } catch {
            errors.push(`${path}: missing documentation`)
            continue
        }

        if (!content.startsWith("# ")) errors.push(`${path}: missing document title`)
        if (!content.includes(name === "README.md" ? "README.zh-CN.md" : "README.md")) errors.push(`${path}: missing language switch`)
        if (/格数|geshu/i.test(content)) errors.push(`${path}: documentation must describe the independent library`)

        for (const match of content.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
            const target = match[1]
            if (/^(?:[a-z]+:|#)/i.test(target)) continue
            const local = decodeURIComponent(target.split("#")[0])

            try {
                await access(resolve(dirname(path), local))
            } catch {
                errors.push(`${path}: broken link ${target}`)
            }
        }
    }
}

for (const { manifest } of packages) {
    if (!manifest.private && !manifest.files?.includes("README.zh-CN.md"))
        errors.push(`${manifest.name}: Chinese documentation must be included in package files`)
}

if (errors.length) {
    console.error(errors.join("\n"))
    process.exitCode = 1
} else console.log(`Verified bilingual README files and local links for the repository and ${packages.length} workspace packages.`)
