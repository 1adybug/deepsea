# Testing guide

[English](TESTING.md) | [简体中文](TESTING.zh-CN.md)

All 40 workspace packages have executable test tasks. Runtime tests, type contracts, build consumption and compatibility-entry checks validate different boundaries and complement each other.

## Commands

```sh
pnpm test
pnpm test:types
pnpm test:coverage
pnpm check

# Focus on one package after building its prerequisites
pnpm --filter @1adybug/components... build
pnpm --filter @1adybug/components test
pnpm --filter @1adybug/components test:types
```

## Test matrix

| Package                                                         | Main scenarios                                                                                                                                                                                                                                                                      |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@1adybug/array`](packages/array/tests)                        | Every ArrayFunctions method, sparse arrays, array-like receivers, species, coercion, invalid inputs, prototype installation, pure/global isolation, generated entry resolution and bundling.                                                                                        |
| [`@1adybug/tools`](packages/tools/tests)                        | Parsers, enum mappings, object/collection identity, tree traversal, pagination boundaries, middleware ordering, validation failures, storage events, cookies, downloads, spreadsheet conversion, deterministic random boundaries and frame cancellation.                            |
| [`@1adybug/types`](packages/types/tests)                        | All exported type utilities: positive and negative equality, union optionality, JSON-compatible shapes, strict keys, readonly errors, query/form round-trips, tuple boundaries and required/optional parameters.                                                                    |
| [`@1adybug/store`](packages/store/tests)                        | Lazy initialization, merge/replace, Object.is no-ops, selectors, subscriptions, server rendering, codec access, corrupt data, async hydration races and storage failures.                                                                                                           |
| [`@1adybug/hooks`](packages/hooks/tests)                        | Each hook's state/identity and lifecycle contracts, repeated query values, storage areas, dependency changes, DOM listener replacement, drag/press cancellation, observer cleanup, autoplay retry, ETag changes and media watchdogs.                                                |
| [`@1adybug/react`](packages/react/tests)                        | Primitives, nested iterables, invalid values, escaped markup, bigint conversion and invalid-child diagnostics.                                                                                                                                                                      |
| [`@1adybug/components`](packages/components/tests)              | All public components and helpers: meaningful DOM/prop behavior, measurements, interaction, refs, timers, file errors, clipboard, chart updates/disposal and media recovery/cleanup. Third-party rendering engines and WebRTC negotiation are mocked at their integration boundary. |
| [`@1adybug/coordinate`](packages/coordinate/tests)              | Constructor overloads, normalization failures, fixed conversion references, conversion round-trips, distance symmetry/bounds, segment contact, self-intersections and region inclusion/exclusion.                                                                                   |
| [`@1adybug/node`](packages/node/tests)                          | Real temporary-file copy and binary stream saving, missing/writable paths, source stream errors, child exit/error handling, command encoding, archive contents and 7-Zip argument construction without requiring 7-Zip in tests.                                                    |
| [`@1adybug/antd`](packages/antd/tests)                          | Selection filtering and invalidation, search callbacks, Theme scope, form subscriptions, tree checking/selection without input mutation, scroll measurements, schema failures, date boundaries and rendered worksheets.                                                             |
| [`@1adybug/heroui`](packages/heroui/tests)                      | Every field adapter's empty/value/change/blur/error contract, enum factories and field bindings, selection clearing, nested provider isolation, date/range identity, toast lifecycle and update notifications.                                                                      |
| [`@1adybug/tanstack-form`](packages/tanstack-form/tests)        | Field injection, map generation, refreshed context, forwarded change/blur/extra props and empty/truthy error arrays.                                                                                                                                                                |
| [`@1adybug/tanstack-query`](packages/tanstack-query/tests)      | Real QueryClient caching, parameter changes, selections, initial/disabled states, error identity, client overrides, refinements, injected query hooks and mutation success/error/settled ordering.                                                                                  |
| [`@1adybug/next`](packages/next/tests)                          | Encoded parameters, functional updates after route changes, setter identity, push/replace options, typed query delegation and Navigate behavior against a mocked Next navigation boundary.                                                                                          |
| [`@1adybug/react-router`](packages/react-router/tests)          | Real MemoryRouter updates, preserved unrelated parameters, repeated-value parsing, deletion, replacement and injected adapter options.                                                                                                                                              |
| [`@1adybug/react-router-cli`](packages/react-router-cli/tests)  | Temporary-project route generation, custom paths, aliases, errors, lazy/data routes, precedence, stable mtimes, watcher coalescing/recovery, Vite reload/disposal and Rsbuild lifecycle hooks.                                                                                      |
| [`@1adybug/next-cli`](packages/next-cli/tests)                  | Clean temporary-project action/route generation, deterministic registry ordering, relative/alias imports, ignored assets, stale artifact removal, directory pruning, no-op mtimes and CLI help/version.                                                                             |
| [`@1adybug/tailwind`](packages/tailwind/tests)                  | Actual PostCSS/Tailwind compilation of each utility, background-size theme extension and variant generation.                                                                                                                                                                        |
| [`@1adybug/xlsx`](tests/xlsx.test.mjs)                          | Both ESM and CommonJS: binary and multi-format round-trips, address boundaries, sheet editing, metadata, escaped CSV/HTML, filesystem writes/reads, streaming, formatting and compound-file containers.                                                                             |
| [`@1adybug/build-config`](tooling/build-config/tests)           | Clean-package build and consumption in ESM/CJS, declaration failure, target/React detection, export filtering and stable output.                                                                                                                                                    |
| [`@1adybug/typescript-config`](tooling/typescript-config/tests) | Compiler-resolved inheritance for all presets, consumer overrides and a real strict-nullability diagnostic.                                                                                                                                                                         |
| compat/*                                                        | Each package's forwarding code, declarations, dependency/peer parity, ESM/CJS identity, CLI and representative wildcard entries                                                                                                                                                     |
| apps/playground                                                 | Actual workspace component mounting, DOM and observer cleanup                                                                                                                                                                                                                       |

## Type tests

expectTypeOf does not verify types at runtime. pnpm test:types compiles test/type fixtures with TypeScript and checks @ts-expect-error. Utility types should cover valid inference and rejected usage; component generics should cover value types, selection modes and callback arguments.

## Coverage

pnpm test:coverage generates package/coverage/index.html and coverage-summary.json for first-party TypeScript packages and the playground. Reports include unexecuted source and exclude declarations and generated Array forwarding entries. Third-party XLSX code and private MJS tooling use Node tests; compatibility entries have separate contract tests rather than duplicate implementation coverage. Coverage locates omissions and is not sufficient evidence of test quality or completeness.

## Isolation and validation boundaries

File and generator tests use isolated temporary directories and clean their output; process tests are bounded. Time and random boundaries use controlled inputs. React tests unmount components and check listener/timer/observer cleanup. Network, clipboard, chart engines and media negotiation are mocked at external boundaries while library state and adapter logic execute normally. Automation does not replace visual, real-browser media, live-service, cross-device or manual accessibility acceptance.

## Adding tests

Identify the public object's inputs, state transitions, results and side effects, then choose cases that distinguish correct behavior from a plausible bug. Cover relevant boundaries, failure propagation, updates and cleanup. Parameterize genuinely different input semantics. Verify aliases by identity/types and reuse implementation behavior tests. Keep a regression that fails on the original defect. Avoid import-only checks, reimplementing algorithms in expected values, or duplicating assertions for counts.
