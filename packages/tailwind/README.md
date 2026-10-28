# @1adybug/tailwind

[English](README.md) | [简体中文](README.zh-CN.md)

A Tailwind CSS 3 plugin for flexible fill sizing, justified text and full background sizing.

## Features

- fill-x/fill-y flex utilities with zero minimum size.
- justify-text and bg-full theme extension.

## Installation and requirements

```sh
pnpm add @1adybug/tailwind
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

| Peer dependency | Workspace range |
| --------------- | --------------- |
| `tailwindcss`   | `^3.4.19`       |

## Quick start

```tsx
// tailwind.config.ts
import { soda } from "@1adybug/tailwind"

export default {
    content: ["./src/**/*.{ts,tsx}"],
    plugins: [soda()],
}
```

## Public API

| Module                       | Exports |
| ---------------------------- | ------- |
| [src/index.ts](src/index.ts) | `soda`  |

See the linked source and shipped declarations for types, overloads and parameter documentation. package.json exports defines public subpaths.

## Behavior and integration

The exported factory is named soda. This package targets the Tailwind 3 JavaScript plugin API. Add class names to scanned content so the compiler emits their utilities.

## Tests and development

```sh
pnpm --filter @1adybug/tailwind... build
pnpm --filter @1adybug/tailwind test
pnpm --filter @1adybug/tailwind test:types
```

Actual PostCSS/Tailwind compilation of each utility, background-size theme extension and variant generation.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

MIT.
