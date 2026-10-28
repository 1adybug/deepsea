# @1adybug/react-router-cli

[English](README.md) | [简体中文](README.zh-CN.md)

用于 React Router 的文件系统路由生成器，提供 CLI 及 Vite、Rsbuild 开发集成。

## 能力

- 从页面、布局、错误页、loader/action、动态片段、路由组和 catch-all 路由生成 Router。
- 稳定生成输出、项目别名、合并文件事件与开发重载。

## 安装与运行环境

```sh
pnpm add @1adybug/react-router-cli
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

| Peer 依赖       | 工作区范围 |
| --------------- | ---------- |
| `@rsbuild/core` | `^2.2.14`  |
| `vite`          | `^8.3.5`   |

## 快速开始

```tsx
import { createRouter } from "@1adybug/react-router-cli"

await createRouter({
    root: process.cwd(),
    appDir: "app",
    routerOutputPath: "components/Router.tsx",
    routerExportType: "named",
})

// Vite: import { sdrrVitePlugin } from "@1adybug/react-router-cli/vite"
// Rsbuild: import { sdrrRsbuildPlugin } from "@1adybug/react-router-cli/rsbuild"
```

## 公开 API

| 模块                         | 导出                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/index.ts](src/index.ts) | `createRouter`, `ResolvedSdrrOptions`, `SdrrOptions`, `resolveSdrrOptions`, `syncRouter`, `WatchSdrrHooks`, `WatchSdrrOptions`, `watchSdrr` |

导出类型、重载与参数说明见上述源码及随包声明；公开子路径以 package.json 的 exports 为准。

## 行为与集成约束

仅在 Node 中运行生成器，生成源码从宿主应用导入 React 和 React Router。页面使用 page.tsx、布局使用 layout.tsx；[id]、[...path]、[[...path]] 和 (group) 目录描述片段。并行或拦截路由约定不构成 Next.js 运行时。sdrr 提供 build、dev 和 hook 命令；build/dev 可包装 -- 后的命令。API 仅在显式启用时更新编辑器设置。

## 测试与开发

测试使用真实库声明编译生成的 Hook，并验证 CLI 退出码传播、启动失败和配套子进程清理。

```sh
pnpm --filter @1adybug/react-router-cli... build
pnpm --filter @1adybug/react-router-cli test
pnpm --filter @1adybug/react-router-cli test:types
```

临时项目中的路由生成、自定义路径、别名、错误边界、惰性及数据路由、优先级、稳定修改时间、监听合并与恢复、Vite 重载及销毁、Rsbuild 生命周期。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

MIT.
