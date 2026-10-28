# @1adybug/tanstack-form

[English](README.md) | [简体中文](README.zh-CN.md)

在 TanStack Form 字段上下文与可复用 React 字段组件之间提供轻量类型化桥接。

## 能力

- 将单个组件或组件映射绑定到注入的字段上下文 Hook。
- 最小字段契约与基于有效错误值的验证判断。

## 安装与运行环境

```sh
pnpm add @1adybug/tanstack-form
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

| Peer 依赖              | 工作区范围 |
| ---------------------- | ---------- |
| `@tanstack/react-form` | `^1.33.5`  |
| `@types/react`         | `^19.3.0`  |
| `react`                | `^19.3.1`  |

## 快速开始

```tsx
import { type Field, type UseFieldContext, getFieldComponent } from "@1adybug/tanstack-form"

function Input({ field }: { field: Field<string> }) {
    return <input value={field.state.value} onChange={event => field.handleChange(event.target.value)} onBlur={field.handleBlur} />
}

export function bindInput(useFieldContext: UseFieldContext) {
    return getFieldComponent(Input, useFieldContext)
}
```

## 公开 API

| 模块                                                             | 导出                                                                                                                                                         |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [src/utils/getFieldComponent.ts](src/utils/getFieldComponent.ts) | `UseFieldContext`, `FieldContext`, `FieldMeta`, `FieldState`, `Field`, `FieldComponentProps`, `getFieldComponent`, `FieldComponentMap`, `getFieldComponents` |
| [src/utils/isFieldInvalid.ts](src/utils/isFieldInvalid.ts)       | `isFieldInvalid`                                                                                                                                             |

导出类型、重载与参数说明见上述源码及随包声明；公开子路径以 package.json 的 exports 为准。

## 行为与集成约束

传入宿主表单配置对应的上下文 Hook。绑定后的组件从上下文取得 field，并保留其他属性。isFieldInvalid 检查错误项是否有效，而非仅检查数组长度。

## 测试与开发

```sh
pnpm --filter @1adybug/tanstack-form... build
pnpm --filter @1adybug/tanstack-form test
pnpm --filter @1adybug/tanstack-form test:types
```

字段注入、组件映射、上下文刷新、变更及失焦与额外属性转发，以及空错误与有效错误数组。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

MIT.
