# @1adybug/xlsx

[English](README.md) | [简体中文](README.zh-CN.md)

Spreadsheet parsing and writing through a packaged SheetJS-based runtime, including workbook utilities and Node/browser entry points.

## Features

- Read/write workbooks and convert sheets to/from object arrays, CSV, HTML and other spreadsheet formats.
- ESM/CommonJS, browser bundles, optional code pages, formatting/container helpers and streaming output.

## Installation and requirements

```sh
pnpm add @1adybug/xlsx
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

This package declares no peer dependencies.

## Quick start

```tsx
import * as XLSX from "@1adybug/xlsx"

const workbook = XLSX.utils.book_new()
const sheet = XLSX.utils.json_to_sheet([{ name: "Alpha", count: 3 }])
XLSX.utils.book_append_sheet(workbook, sheet, "Data")
const binary = XLSX.write(workbook, { type: "array", bookType: "xlsx" })
const restored = XLSX.read(binary, { type: "array" })
XLSX.utils.sheet_to_json(restored.Sheets.Data)
```

## Public API

| Entry | Purpose |
| --- | --- |
| `read / readFile / write / writeFile` | Workbook parsing and serialization |
| `utils` | Addressing, workbook/sheet construction, metadata and conversions |
| `stream / SSF / CFB` | Streaming, value formatting and compound containers |
| `set_fs / set_cptable` | Host filesystem and encoding integration |

Full signatures are in [types/index.d.ts](types/index.d.ts); the executable is xlsx.

## Behavior and integration

This package contains third-party spreadsheet code under Apache-2.0; keep its LICENSE and notices. Formula text is preserved, not evaluated by a calculation engine. ESM filesystem use requires set_fs with node:fs; browser applications should use read/write with byte arrays. File/stream APIs require their corresponding Node facilities. Select encoding support through the exported cpexcel entries when needed.

## Tests and development

```sh
pnpm --filter @1adybug/xlsx test
```

Both ESM and CommonJS: binary and multi-format round-trips, address boundaries, sheet editing, metadata, escaped CSV/HTML, filesystem writes/reads, streaming, formatting and compound-file containers.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

Apache-2.0. See [LICENSE](LICENSE).
