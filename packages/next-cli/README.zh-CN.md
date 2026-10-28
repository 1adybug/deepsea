# @1adybug/next-cli

[English](README.md) | [简体中文](README.zh-CN.md)

从共享模块生成 Next.js 服务端 Action、Action 路由注册表及客户端查询与变更 Hook 的项目 CLI。

## 能力

- 构建并监听共享模块，可选包装宿主开发或构建命令。
- 确定性的 Action 与路由输出、项目导入别名和可配置 Hook 生成。

## 安装与运行环境

```sh
pnpm add @1adybug/next-cli
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

本包未声明 peer 依赖。

## 快速开始

```sh
# Run inside a Next.js project with shared/ and server/createResponseFn
pnpm exec sdnext --help
pnpm exec sdnext build
pnpm exec sdnext dev -- next dev
pnpm exec sdnext hook
```

## 公开 API

| 入口           | 用途                           |
| -------------- | ------------------------------ |
| `sdnext build` | 生成产物，可选运行后续命令     |
| `sdnext dev`   | 生成并监听产物，可选运行子命令 |
| `sdnext hook`  | 交互生成查询与变更 Hook        |

导出类型、重载与参数说明见上述源码及随包声明；公开子路径以 package.json 的 exports 为准。

## 行为与集成约束

本包为可执行包，导入根入口会运行 CLI 参数解析。应在目标项目中运行 sdnext。共享模块需导出与文件同名的函数，生成文件依赖宿主的 server/createResponseFn 辅助函数。输出位于 actions/ 和 app/api/action/[...action]/route.ts。hook 为交互命令，可将选择保存在 ~/.sdnext.json。生成源码应纳入宿主应用审查。

## 测试与开发

测试使用真实库声明编译生成的 Hook，并验证 CLI 退出码传播、启动失败和配套子进程清理。

```sh
pnpm --filter @1adybug/next-cli... build
pnpm --filter @1adybug/next-cli test
pnpm --filter @1adybug/next-cli test:types
```

独立临时项目的 Action 与路由生成、注册表排序、相对与别名导入、忽略资源、旧产物移除、目录清理、无变化时修改时间和 CLI 帮助及版本。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

MIT.
