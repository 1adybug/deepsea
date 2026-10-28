# @1adybug/next

[English](README.md) | [简体中文](README.zh-CN.md)

用于 Next.js App Router 查询状态与声明式导航的 React 工具。

## 能力

- 基于 next/navigation 的类型化查询解析与序列化。
- 支持可配置滚动行为的 push 与 replace 导航。

## 安装与运行环境

```sh
pnpm add @1adybug/next
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

| Peer 依赖      | 工作区范围 |
| -------------- | ---------- |
| `@types/react` | `^19.3.0`  |
| `next`         | `^16.4.3`  |
| `react`        | `^19.3.1`  |

## 快速开始

```tsx
"use client"

import { useQueryState } from "@1adybug/next"

export function Pager() {
    const [query, setQuery] = useQueryState({
        parse: { page: value => Number(value ?? 1) },
        replace: true,
    })

    return <button onClick={() => setQuery({ page: query.page + 1 })}>Next</button>
}
```

## 公开 API

| 模块                                                                 | 导出                                                |
| -------------------------------------------------------------------- | --------------------------------------------------- |
| [src/components/Navigate.tsx](src/components/Navigate.tsx)           | `NavigateProps`, `Navigate`                         |
| [src/hooks/useNextSearchParams.ts](src/hooks/useNextSearchParams.ts) | `SetNextSearchParamsOptions`, `useNextSearchParams` |
| [src/hooks/useQueryState.ts](src/hooks/useQueryState.ts)             | `useQueryState`                                     |
| [src/types/index.ts](src/types/index.ts)                             | `PageError`, `ErrorPageProps`, `DynamicPageProps`   |

导出类型、重载与参数说明见上述源码及随包声明；公开子路径以 package.json 的 exports 为准。

## 行为与集成约束

在 Next.js App Router 客户端组件边界中使用。useQueryState 默认 scroll: false，精确模式保留其他参数。稳定的查询 setter 使用最近一次渲染的路径、查询快照和导航选项。

## 测试与开发

```sh
pnpm --filter @1adybug/next... build
pnpm --filter @1adybug/next test
pnpm --filter @1adybug/next test:types
```

参数编码、路由变化后的函数式更新、setter 引用、push 与 replace 选项、查询状态委托，以及模拟 Next 导航边界下的 Navigate 行为。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

MIT.
