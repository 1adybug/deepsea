import { rm } from "fs/promises"
import { join, relative } from "path"

import { watch } from "chokidar"

import { createAction } from "./createAction"

const watcher = watch("shared", {
    awaitWriteFinish: true,
    persistent: true,
})

watcher.on("add", createAction)

watcher.on("change", createAction)

watcher.on("unlink", async path => {
    path = relative("shared", path).replace(/\\/g, "/")
    const actionPath = join("actions", path)
    await rm(actionPath, { recursive: true, force: true })
})

watcher.on("unlinkDir", async path => {
    path = relative("shared", path).replace(/\\/g, "/")
    const actionPath = join("actions", path)
    await rm(actionPath, { recursive: true, force: true })
})
