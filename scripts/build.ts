import { spawn } from "node:child_process"
import { readdir, readFile } from "node:fs/promises"

function spawnAsync(command: string, cwd?: string) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, { shell: true, stdio: "inherit", cwd })
        child.on("exit", code => {
            if (code !== 0) return reject(new Error(`Command failed with code ${code}`))
            resolve(0)
        })
    })
}

interface WorkspaceDep {
    name: string
    deps: string[]
}

async function main() {
    const dir = await readdir("packages")
    const buildOrder: string[] = []
    let workspaceDeps: WorkspaceDep[] = []
    for (const item of dir) {
        const packageJSON = JSON.parse(await readFile(`packages/${item}/package.json`, "utf-8"))
        if (!packageJSON.devDependencies?.father) return
        const dep: WorkspaceDep = {
            name: item,
            deps: []
        }
        Object.entries(packageJSON.dependencies || {}).forEach(([name, version]: [string, any]) => {
            if (version.startsWith("workspace:")) {
                dep.deps.push(name)
            }
        })
        Object.entries(packageJSON.devDependencies || {}).forEach(([name, version]: [string, any]) => {
            if (version.startsWith("workspace:")) {
                dep.deps.push(name)
            }
        })
        workspaceDeps.push(dep)
    }
    function addOrder() {
        for (const dep of workspaceDeps) {
            if (dep.deps.every(d => buildOrder.includes(d))) buildOrder.push(dep.name)
        }
        workspaceDeps = workspaceDeps.filter(dep => !buildOrder.includes(dep.name))
        if (workspaceDeps.length === 0) return
        addOrder()
    }
    addOrder()
    for (const item of buildOrder) {
        await spawnAsync("pnpm build", `packages/${item}`)
    }
}

main()
