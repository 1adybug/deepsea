#!/usr/bin/env node

import { execSync } from "node:child_process"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import * as process from "node:process"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")
const packagesDir = path.resolve(rootDir, "packages")

/**
 * 获取所有包信息
 */
async function getPackages() {
    const packages = {}

    const dirs = await readdir(packagesDir)

    // 排除playground
    const filteredDirs = dirs.filter(dir => dir !== "playground")

    for (const dir of filteredDirs) {
        const packageJsonPath = path.join(packagesDir, dir, "package.json")

        try {
            const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"))
            packages[packageJson.name] = {
                dir,
                name: packageJson.name,
                dependencies: [],
                isBuilt: false,
            }

            // 收集依赖信息
            const deps = {
                ...(packageJson.dependencies || {}),
                ...(packageJson.devDependencies || {}),
                ...(packageJson.peerDependencies || {}),
            }

            // 只关注内部依赖(workspace:*)
            Object.entries(deps).forEach(([name, version]) => {
                if (version.includes("workspace:")) packages[packageJson.name].dependencies.push(name)
            })
        } catch (error) {
            console.error(`读取 ${dir} 的 package.json 失败:`, error.message)
        }
    }

    return packages
}

/**
 * 构建单个包
 */
async function buildPackage(packageName, packages) {
    const pkg = packages[packageName]

    if (pkg.isBuilt) return

    // 首先构建所有依赖
    for (const dep of pkg.dependencies) {
        // 如果依赖是内部包，则先构建它
        if (packages[dep]) await buildPackage(dep, packages)
    }

    console.log(`🔨 正在构建 ${pkg.name}...`)

    try {
        // 进入包目录执行构建
        const packageDir = path.join(packagesDir, pkg.dir)

        execSync("pnpm run build", {
            cwd: packageDir,
            stdio: "inherit",
        })

        pkg.isBuilt = true
        console.log(`✅ ${pkg.name} 构建成功`)
    } catch (error) {
        console.error(`❌ ${pkg.name} 构建失败:`, error.message)
        process.exit(1)
    }
}

/**
 * 主函数
 */
async function build() {
    console.log("📦 开始构建所有包...")

    try {
        const packages = await getPackages()

        // 如果没有找到包
        if (Object.keys(packages).length === 0) {
            console.log("没有找到需要构建的包")
            return
        }

        // 构建所有包
        for (const packageName of Object.keys(packages)) await buildPackage(packageName, packages)

        console.log("🎉 所有包构建完成!")
    } catch (error) {
        console.error("构建过程中发生错误:", error.message)
        process.exit(1)
    }
}

// 执行构建
build().catch(err => {
    console.error("构建失败:", err)
    process.exit(1)
})
