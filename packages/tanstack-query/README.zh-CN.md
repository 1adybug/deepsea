# @1adybug/tanstack-query

[English](README.md) | [简体中文](README.zh-CN.md)

用于创建可复用 TanStack Query 查询与变更 Hook 的类型化工厂。

## 能力

- 参数化查询键、初始数据、调用级选项和可派生查询 Hook。
- 共享变更默认值、有序生命周期回调和显式 QueryClient 选择。

## 安装与运行环境

```sh
pnpm add @1adybug/tanstack-query
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

| Peer 依赖               | 工作区范围 |
| ----------------------- | ---------- |
| `@tanstack/react-query` | `^5.105.0` |
| `@types/react`          | `^19.3.0`  |
| `react`                 | `^19.3.1`  |

## 快速开始

```tsx
import { createUseQuery } from "@1adybug/tanstack-query"

const useItem = createUseQuery({
    queryKey: "item",
    queryFn: async (id: number) => ({ id, name: `Item ${id}` }),
})

const useItemName = useItem.refine({ select: item => item.name })

function ItemName() {
    const query = useItemName(1)
    return <span>{query.data}</span>
}
```

## 公开 API

| 模块                                                             | 导出                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/utils/createUseMutation.ts](src/utils/createUseMutation.ts) | `CreateUseMutationOptions`, `UseConfiguredMutation`, `createUseMutation`, `withUseMutationDefaults`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| [src/utils/createUseQuery.ts](src/utils/createUseQuery.ts)       | `UseQueryWithParams`, `UseQueryWithOptionalParams`, `UseQuery`, `CreateUseQueryDefinedInitialDataParams`, `UseQueryDefinedInitialDataWithParams`, `UseQueryDefinedInitialDataWithOptionalParams`, `_UseQueryDefinedInitialData`, `UseQueryDefinedInitialData`, `CreateUseQueryUndefinedInitialDataParams`, `UseQueryUndefinedInitialDataWithParams`, `UseQueryUndefinedInitialDataWithOptionalParams`, `UseQueryUndefinedInitialData`, `CreateUseQueryParams`, `setUseQuery`, `createUseQuery`, `GetHookFromParams` |

导出类型、重载与参数说明见上述源码及随包声明；公开子路径以 package.json 的 exports 为准。

## 行为与集成约束

在宿主 QueryClientProvider 下渲染，或向工厂、调用传入 QueryClient。查询缓存键为 [queryKey, params]。变更基础回调先于覆盖回调执行，覆盖 onMutate 的返回值作为变更上下文向后传递。查询和变更函数应遵循 TanStack Query 错误语义。

## 测试与开发

```sh
pnpm --filter @1adybug/tanstack-query... build
pnpm --filter @1adybug/tanstack-query test
pnpm --filter @1adybug/tanstack-query test:types
```

真实 QueryClient 缓存、参数变化、选择、初始与禁用状态、错误引用、Client 覆盖、派生配置、查询 Hook 注入和变更成功、错误与结束回调顺序。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

MIT.
