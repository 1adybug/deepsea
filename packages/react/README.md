# @1adybug/react

[English](README.md) | [简体中文](README.zh-CN.md)

React node validation and text/worksheet-cell conversion helpers.

## Features

- Validate primitive, element and nested iterable children.
- Extract text from rendered markup and preserve worksheet-friendly primitive values.

## Installation and requirements

```sh
pnpm add @1adybug/react
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

| Peer dependency    | Workspace range |
| ------------------ | --------------- |
| `@types/react`     | `^19.3.0`       |
| `@types/react-dom` | `^19.3.0`       |
| `react`            | `^19.3.1`       |
| `react-dom`        | `^19.3.1`       |

## Quick start

```tsx
import { isReactNode, renderToText, renderToWorkSheetCell } from "@1adybug/react"

isReactNode(["Hello", <strong key="name">World</strong>]) // true

renderToText(<span>Hello &amp; World</span>) // "Hello & World"

renderToWorkSheetCell(42n) // "42"
```

## Public API

| Module                                                                   | Exports                 |
| ------------------------------------------------------------------------ | ----------------------- |
| [src/utils/isReactNode.ts](src/utils/isReactNode.ts)                     | `isReactNode`           |
| [src/utils/renderToText.ts](src/utils/renderToText.ts)                   | `renderToText`          |
| [src/utils/renderToWorkSheetCell.ts](src/utils/renderToWorkSheetCell.ts) | `renderToWorkSheetCell` |

See the linked source and shipped declarations for types, overloads and parameter documentation. package.json exports defines public subpaths.

## Behavior and integration

Markup-to-text conversion uses DOMParser and needs a browser or a DOM-enabled environment. Promise children are not recognized by `isReactNode`. Worksheet conversion preserves numeric/boolean values and stringifies bigint; unsupported values become an empty string.

## Tests and development

```sh
pnpm --filter @1adybug/react... build
pnpm --filter @1adybug/react test
pnpm --filter @1adybug/react test:types
```

Primitives, nested iterables, invalid values, escaped markup, bigint conversion and invalid-child diagnostics.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

MIT.
