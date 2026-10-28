# @1adybug/node

[English](README.md) | [简体中文](README.zh-CN.md)

Node.js 文件、响应流、子进程与归档工具。

## 能力

- 递归复制、File 与 Response 保存、Shell 执行和可访问进程实例的异步 spawn。
- gzip tar 创建和 7-Zip 压缩解压。

## 安装与运行环境

```sh
pnpm add @1adybug/node
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

本包未声明 peer 依赖。

## 快速开始

```tsx
import { copy, saveResponse, spawnAsync } from "@1adybug/node"

await copy({ input: "assets", output: "output" })
await saveResponse(new Response("example"), "output/example.txt")
const run = spawnAsync(process.execPath, ["--version"])
await run // run.child exposes the ChildProcess
```

## 公开 API

| 模块                                                   | 导出                                                                                         |
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

导出类型、重载与参数说明见上述源码及随包声明；公开子路径以 package.json 的 exports 为准。

## 行为与集成约束

本包仅用于 Node。`zip` 和 `unzip` 要求 PATH 中存在 7z；`compress` 使用 tar 依赖。归档文件名通过独立进程参数传递。`execAsync` 执行 Shell 命令文本，`spawnAsync` 接收可执行文件及参数数组。复制、保存和归档会写入指定路径，并传播 I/O 错误。

## 测试与开发

```sh
pnpm --filter @1adybug/node... build
pnpm --filter @1adybug/node test
pnpm --filter @1adybug/node test:types
```

真实临时文件复制与二进制流保存、缺失路径与写入失败、源流错误、子进程退出与错误、命令输出编码、归档内容，以及无需安装 7-Zip 的参数构造测试。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

MIT.
