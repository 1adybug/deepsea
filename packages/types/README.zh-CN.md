# @1adybug/types

[English](README.md) | [简体中文](README.zh-CN.md)

编译期 TypeScript 类型工具，支持联合类型分析、严格对象变换、元组索引、函数参数和查询模型。

## 能力

- 联合类型键、可选性、交集与递归组合。
- 时间戳到范围查询类型的转换，以及指定属性的可选、必选或只读变换。

## 安装与运行环境

```sh
pnpm add @1adybug/types
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

本包未声明 peer 依赖。

## 快速开始

```tsx
import type { QueryParams, StrictPartial, ValueOf } from "@1adybug/types"

type RecordData = { id: number; createdAt: Date; label: string }

type Search = QueryParams<RecordData, number>

// id, label, createdAfter, createdBefore
type Draft = StrictPartial<RecordData, "id">

type Status = ValueOf<{ ready: "ready"; idle: "idle" }>
```

## 公开 API

| 模块                         | 导出                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/index.ts](src/index.ts) | `Equal`, `IsNever`, `UnionToIntersection`, `LastUnion`, `UnionToTuple`, `IsRequired`, `KeyOfUnion`, `IsOptionalInUnion`, `IsRequiredInUnion`, `OptionalKeysInUnion`, `RequiredKeysInUnion`, `PossibleValuesInUnion`, `IsObject`, `ObjectInUnion`, `ArrayInUnion`, `NonObjectOrArrayInUnion`, `CombineUnion`, `CommonType`, `CanJSONStringify`, `TipString`, `EditorProps`, `StrictOmit`, `ValueOf`, `FirstParameter`, `StrictPartial`, `StrictRequired`, `StrictReadonly`, `TupleToObject`, `QueryParams`, `QueryFormData`, `StrKeyOf`, `GetIndices`, `GetIndex`, `IsParamRequired`, `Assign` |

导出类型、重载与参数说明见上述源码及随包声明；公开子路径以 package.json 的 exports 为准。

## 行为与集成约束

本包不提供运行时工具。类型断言由 `test:types` 中的 TypeScript 编译器验证；仅运行 Vitest 无法验证类型相等性或预期编译错误。

## 测试与开发

```sh
pnpm --filter @1adybug/types... build
pnpm --filter @1adybug/types test
pnpm --filter @1adybug/types test:types
```

全部导出的类型工具：正反类型相等断言、联合类型可选性、JSON 结构、严格键、只读赋值错误、查询与表单转换、元组边界和参数可选性。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

MIT.
