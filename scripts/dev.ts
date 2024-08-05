import { spawnAsync } from "soda-nodejs"
import { readdir, readFile } from "node:fs/promises"

async function main() {
    const dir = await readdir("packages")
    const dependencies: Record<string, string[]> = {}
    for (const item of dir) {
        const packageJSON = JSON.parse(await readFile(`packages/${item}/package.json`, "utf-8"))
        if (packageJSON.private) continue
        dependencies[item] = Object.entries({
            ...packageJSON.dependencies,
            ...packageJSON.devDependencies,
            ...packageJSON.peerDependencies,
            ...packageJSON.optionalDependencies
        })
            .filter(([name, version]) => (version as string).includes("workspace:"))
            .map(([name]) => name)
    }
    while (true) {
        const buildable = Object.keys(dependencies).filter(name => dependencies[name].length === 0)
        if (buildable.length === 0) break
        for (const [name] of buildable) {
            await spawnAsync("pnpm build", { cwd: `packages/${name}`, stdio: "inherit", shell: true })
            delete dependencies[name]
            Object.keys(dependencies).forEach(pkg => (dependencies[pkg] = dependencies[pkg].filter(dep => dep !== name)))
        }
    }
}

main()
