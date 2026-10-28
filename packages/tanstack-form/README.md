# @1adybug/tanstack-form

[English](README.md) | [简体中文](README.zh-CN.md)

Small typed bridges between TanStack Form field context and reusable React field components.

## Features

- Bind one component or a component map to an injected field-context hook.
- Minimal field contracts and truthy-error validation checks.

## Installation and requirements

```sh
pnpm add @1adybug/tanstack-form
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

| Peer dependency        | Workspace range |
| ---------------------- | --------------- |
| `@tanstack/react-form` | `^1.33.5`       |
| `@types/react`         | `^19.3.0`       |
| `react`                | `^19.3.1`       |

## Quick start

```tsx
import { type Field, type UseFieldContext, getFieldComponent } from "@1adybug/tanstack-form"

function Input({ field }: { field: Field<string> }) {
    return <input value={field.state.value} onChange={event => field.handleChange(event.target.value)} onBlur={field.handleBlur} />
}

export function bindInput(useFieldContext: UseFieldContext) {
    return getFieldComponent(Input, useFieldContext)
}
```

## Public API

| Module                                                           | Exports                                                                                                                                                      |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [src/utils/getFieldComponent.ts](src/utils/getFieldComponent.ts) | `UseFieldContext`, `FieldContext`, `FieldMeta`, `FieldState`, `Field`, `FieldComponentProps`, `getFieldComponent`, `FieldComponentMap`, `getFieldComponents` |
| [src/utils/isFieldInvalid.ts](src/utils/isFieldInvalid.ts)       | `isFieldInvalid`                                                                                                                                             |

See the linked source and shipped declarations for types, overloads and parameter documentation. package.json exports defines public subpaths.

## Behavior and integration

Pass the context hook belonging to the host form setup. Bound components obtain field from context and expose the remaining props. isFieldInvalid checks truthy entries rather than error-array length.

## Tests and development

```sh
pnpm --filter @1adybug/tanstack-form... build
pnpm --filter @1adybug/tanstack-form test
pnpm --filter @1adybug/tanstack-form test:types
```

Field injection, map generation, refreshed context, forwarded change/blur/extra props and empty/truthy error arrays.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

MIT.
