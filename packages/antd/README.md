# @1adybug/antd

[English](README.md) | [简体中文](README.zh-CN.md)

Ant Design helpers for typed selections, searchable options, reactive forms, filtered trees, table sizing and worksheet export.

## Features

- EnumSelect/NiceSearch, component-scoped Theme providers and FormSubscribe.
- Zod rules, tree state projection, scroll measurements, date ranges and rendered table exports.

## Installation and requirements

```sh
pnpm add @1adybug/antd
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

| Peer dependency    | Workspace range |
| ------------------ | --------------- |
| `@types/react`     | `^19.3.0`       |
| `@types/react-dom` | `^19.3.0`       |
| `antd`             | `^6.6.8`        |
| `react`            | `^19.3.1`       |
| `react-dom`        | `^19.3.1`       |
| `zod`              | `^4.6.7`        |

## Quick start

```tsx
import { EnumSelect, Theme } from "@1adybug/antd"

const Status = { Ready: "ready", Idle: "idle" } as const

function StatusSelect() {
    return (
        <Theme.Select colorPrimary="#2563eb">
            <EnumSelect enumObject={Status} allowClear onChange={value => console.log(value)} />
        </Theme.Select>
    )
}
```

## Public API

| Module                                                               | Exports                                                                                                                                                       |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/components/EnumSelect.tsx](src/components/EnumSelect.tsx)       | `SelectOptions`, `EnumValue`, `SelectValue`, `EnumOption`, `EnumSelectProps`, `EnumSelect`, `EnumSelectComponent`, `createEnumSelect`                         |
| [src/components/FormSubscribe.tsx](src/components/FormSubscribe.tsx) | `FormSubscribeProps`, `FormSubscribe`                                                                                                                         |
| [src/components/NiceSearch.tsx](src/components/NiceSearch.tsx)       | `NiceSearchOption`, `NiceSearchFilterItem`, `NiceSearchSearchConfig`, `NiceSearchProps`, `NiceSearch`                                                         |
| [src/components/Theme.tsx](src/components/Theme.tsx)                 | `ComponentsConfig`, `ThemeComponentProps`, `ThemeMap`, `Theme`                                                                                                |
| [src/hooks/useFilterTree.ts](src/hooks/useFilterTree.ts)             | `BasicTreeDataNode`, `TreeDataNode`, `SelectInfo`, `NodePosition`, `CheckInfo`, `UseFilterTreeParams`, `FilterTreeProps`, `CheckedKeys`, `useFilterTreeProps` |
| [src/hooks/useScroll.ts](src/hooks/useScroll.ts)                     | `UseScrollOptions`, `useScroll`                                                                                                                               |
| [src/types/index.ts](src/types/index.ts)                             | `Column`, `Columns`, `EditorProps`                                                                                                                            |
| [src/utils/aclsm.ts](src/utils/aclsm.ts)                             | `aclsm`                                                                                                                                                       |
| [src/utils/getTimeRange.ts](src/utils/getTimeRange.ts)               | `getTimeRange`                                                                                                                                                |
| [src/utils/getWorkSheet.ts](src/utils/getWorkSheet.ts)               | `GetWorkSheetParams`, `getWorkSheet`                                                                                                                          |
| [src/utils/schemaToRule.ts](src/utils/schemaToRule.ts)               | `schemaToRuleParams`, `schemaToRule`                                                                                                                          |

See the linked source and shipped declarations for types, overloads and parameter documentation. package.json exports defines public subpaths.

## Behavior and integration

Use the same React and Ant Design instances as the host application. Install a compatible Zod version for schemaToRule. Selects normally remove unavailable values unless loading or allowUnavailableValue is enabled. useFilterTreeProps keeps full-tree state while exposing a filtered projection.

## Tests and development

```sh
pnpm --filter @1adybug/antd... build
pnpm --filter @1adybug/antd test
pnpm --filter @1adybug/antd test:types
```

Selection filtering and invalidation, search callbacks, Theme scope, form subscriptions, tree checking/selection without input mutation, scroll measurements, schema failures, date boundaries and rendered worksheets.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

MIT.
