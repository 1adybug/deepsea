# @1adybug/xlsx

[English](README.md) | [简体中文](README.zh-CN.md)

基于随包提供的 SheetJS 运行时代码解析和写入电子表格，提供工作簿工具及 Node、浏览器入口。

## 能力

- 读取和写入工作簿，并在对象数组、CSV、HTML 等电子表格格式间转换。
- ESM、CommonJS、浏览器构建、可选代码页、格式与容器工具，以及流式输出。

## 安装与运行环境

```sh
pnpm add @1adybug/xlsx
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

本包未声明 peer 依赖。

## 快速开始

```tsx
import * as XLSX from "@1adybug/xlsx"

const workbook = XLSX.utils.book_new()
const sheet = XLSX.utils.json_to_sheet([{ name: "Alpha", count: 3 }])
XLSX.utils.book_append_sheet(workbook, sheet, "Data")
const binary = XLSX.write(workbook, { type: "array", bookType: "xlsx" })
const restored = XLSX.read(binary, { type: "array" })
XLSX.utils.sheet_to_json(restored.Sheets.Data)
```

## 公开 API

| 入口 | 用途 |
| --- | --- |
| `read / readFile / write / writeFile` | 工作簿解析与序列化 |
| `utils` | 地址、工作簿及工作表构造、元数据和转换 |
| `stream / SSF / CFB` | 流输出、值格式化和复合容器 |
| `set_fs / set_cptable` | 宿主文件系统与编码集成 |

完整签名见 [types/index.d.ts](types/index.d.ts)，可执行命令为 xlsx。

## 行为与集成约束

本包含有 Apache-2.0 许可的第三方电子表格代码，应保留 LICENSE 和声明。公式文本可以保留，但本包不提供公式计算引擎。ESM 文件系统操作需通过 set_fs 注入 node:fs；浏览器应用应使用字节数组形式的 read/write。文件和流 API 需要对应 Node 能力。需要时可通过导出的 cpexcel 入口配置编码支持。

## 测试与开发

```sh
pnpm --filter @1adybug/xlsx test
```

覆盖 ESM 与 CommonJS：二进制及多格式往返、地址边界、工作表编辑、元数据、CSV 与 HTML 转义、文件读写、流输出、格式化和复合文档容器。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

Apache-2.0. 详见 [LICENSE](LICENSE)。
