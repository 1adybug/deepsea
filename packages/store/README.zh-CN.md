# @1adybug/store

[English](README.md) | [简体中文](README.zh-CN.md)

轻量 React 外部状态库，支持选择器、订阅、不可变对象更新和可选持久化。

## 能力

- 在组件外创建状态，可通过 Hook 或命令式方法访问。
- 同步或异步存储恢复、自定义序列化以及服务端快照。

## 安装与运行环境

```sh
pnpm add @1adybug/store
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

| Peer 依赖      | 工作区范围 |
| -------------- | ---------- |
| `@types/react` | `^19.3.0`  |
| `react`        | `^19.3.1`  |

## 快速开始

```tsx
import { createStore } from "@1adybug/store"

const useCounter = createStore({ count: 0 })

function Counter() {
    const [count, setState] = useCounter(state => state.count)
    return <button onClick={() => setState(state => ({ count: state.count + 1 }))}>{count}</button>
}
```

## 公开 API

| 模块                         | 导出                                                                                                                                                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/index.ts](src/index.ts) | `AnyFunction`, `Listener`, `IsPlainObject`, `NewState`, `PlainObjectSetState`, `NonPlainObjectSetState`, `SetState`, `UseStore`, `isPlainObject`, `createStore`, `StateStorage`, `CreatePersistentStoreOption`, `UsePersistentStore`, `createPersistentStore` |

导出类型、重载与参数说明见上述源码及随包声明；公开子路径以 package.json 的 exports 为准。

## 行为与集成约束

普通对象默认浅合并，可在 setter 第二个参数传入 `true` 替换；数组和其他值直接替换。未变化的数据应通过选择器返回稳定快照。持久化键名为 `react-soda-${name}`；异步恢复不会覆盖更新的本地状态。服务端渲染需提供服务端快照。

## 测试与开发

```sh
pnpm --filter @1adybug/store... build
pnpm --filter @1adybug/store test
pnpm --filter @1adybug/store test:types
```

惰性初始化、合并与替换、Object.is 无效更新、选择器、订阅、服务端渲染、自定义编解码、损坏数据、异步恢复竞争与存储失败。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

MIT.
