import { watch } from "chokidar"

import { removeSharedArtifactDirectory, removeSharedArtifacts, syncSharedArtifacts } from "./syncSharedArtifacts"

const watcher = watch("shared", {
    awaitWriteFinish: true,
    persistent: true,
})

watcher.on("add", syncSharedArtifacts)

watcher.on("change", syncSharedArtifacts)

watcher.on("unlink", removeSharedArtifacts)

watcher.on("unlinkDir", removeSharedArtifactDirectory)
