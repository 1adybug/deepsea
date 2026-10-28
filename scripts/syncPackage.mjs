import { readWorkspacePackages } from "./workspace.mjs"

for (const { manifest } of (await readWorkspacePackages()).values()) {
    if (manifest.private) continue
    const response = await fetch(`https://registry-direct.npmmirror.com/-/package/${encodeURIComponent(manifest.name)}/syncs`, {
        method: "PUT",
        signal: AbortSignal.timeout(30_000),
    })
    if (!response.ok) throw new Error(`Mirror sync failed for ${manifest.name}: ${response.status}`)
    console.log(`Requested mirror sync: ${manifest.name}`)
}
