import { watch } from "chokidar"

import { createRouter } from "./createRouter"

const watcher = watch("app", {
    awaitWriteFinish: true,
    persistent: true,
})

watcher.on("ready", createRouter)

watcher.on("all", createRouter)
