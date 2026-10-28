import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"

import { readWorkspacePackages, workspaceRoot } from "./workspace.mjs"

const require = createRequire(import.meta.url)

const registryEnvironment = {}

for (const { manifest } of (await readWorkspacePackages()).values()) {
    if (manifest.private || !manifest.publishConfig?.registry) continue
    const scope = manifest.name.startsWith("@") ? manifest.name.split("/")[0] + ":" : ""
    registryEnvironment[`npm_config_${scope}registry`] = manifest.publishConfig.registry
}

// `pnpm release` has already built and checked the complete dependency graph.
// Rebuilding in parallel publish hooks can delete declarations used by another package.
const result = spawnSync(process.execPath, [require.resolve("@changesets/cli/bin.js"), "publish", ...process.argv.slice(2)], {
    cwd: workspaceRoot,
    stdio: "inherit",
    env: { ...process.env, ...registryEnvironment, npm_config_ignore_scripts: "true", PNPM_CONFIG_IGNORE_SCRIPTS: "true" },
})

if (result.error) console.error(result.error.message)
process.exitCode = result.status ?? 1
