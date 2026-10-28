# @1adybug/node

[English](README.md) | [简体中文](README.zh-CN.md)

Node.js helpers for files, response streams, child processes and archives.

## Features

- Recursive copy, File/Response saving, shell execution and observable spawned processes.
- Gzip tar creation and 7-Zip compression/extraction.

## Installation and requirements

```sh
pnpm add @1adybug/node
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

This package declares no peer dependencies.

## Quick start

```tsx
import { copy, saveResponse, spawnAsync } from "@1adybug/node"

await copy({ input: "assets", output: "output" })
await saveResponse(new Response("example"), "output/example.txt")
const run = spawnAsync(process.execPath, ["--version"])
await run // run.child exposes the ChildProcess
```

## Public API

| Module                                                 | Exports                                                                                      |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| [src/utils/compress.ts](src/utils/compress.ts)         | `CompressionParams`, `compress`                                                              |
| [src/utils/copy.ts](src/utils/copy.ts)                 | `CopyOptions`, `copy`                                                                        |
| [src/utils/execAsync.ts](src/utils/execAsync.ts)       | `IconvLiteDecodeOptions`, `IconvDecodeOptions`, `execAsync`                                  |
| [src/utils/isPathLike.ts](src/utils/isPathLike.ts)     | `isPathLike`                                                                                 |
| [src/utils/saveFile.ts](src/utils/saveFile.ts)         | `SaveFileOptions`, `saveFile`                                                                |
| [src/utils/saveResponse.ts](src/utils/saveResponse.ts) | `saveResponse`                                                                               |
| [src/utils/spawnAsync.ts](src/utils/spawnAsync.ts)     | `PromiseWithChildProcess`, `Options`, `getDefaultOptions`, `setDefaultOptions`, `spawnAsync` |
| [src/utils/unzip.ts](src/utils/unzip.ts)               | `UnzipOptions`, `unzip`                                                                      |
| [src/utils/zip.ts](src/utils/zip.ts)                   | `ZipOptions`, `zip`                                                                          |

See the linked source and shipped declarations for types, overloads and parameter documentation. package.json exports defines public subpaths.

## Behavior and integration

Node-only package. `zip` and `unzip` require a 7z executable on PATH; `compress` uses the bundled tar dependency. Archive filenames are passed as literal process arguments. `execAsync` runs shell command text; `spawnAsync` accepts an executable and argument array. Copy/save/archive calls write to caller-provided paths and propagate I/O errors.

## Tests and development

```sh
pnpm --filter @1adybug/node... build
pnpm --filter @1adybug/node test
pnpm --filter @1adybug/node test:types
```

Real temporary-file copy and binary stream saving, missing/writable paths, source stream errors, child exit/error handling, command encoding, archive contents and 7-Zip argument construction without requiring 7-Zip in tests.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

MIT.
