# @1adybug/build-config

[English](README.md) | [简体中文](README.zh-CN.md)

工作区内部使用的共享 Rslib 配置与确定性导出文件生成工具。

## 能力

- Web 默认生成 ESM/CJS，Node 默认生成 ESM；声明仅生成一次，类型错误会导致构建失败。
- 自动检测 React 插件，并生成排好序且排除声明与测试文件的导出文件。

## 安装与运行环境

```sh
pnpm add -D @1adybug/build-config@workspace:*
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

本包未声明 peer 依赖。

## 快速开始

```tsx
import { getRslibConfig } from "@1adybug/build-config"

export default getRslibConfig({ target: "web" })

// Scripts can use getExports(root) and writeCode(file, content)
// from @1adybug/build-config/exports.
```

## 公开 API

| 入口        | 用途             |
| ----------- | ---------------- |
| `.`         | 共享构建配置     |
| `./exports` | 导出的工作区资源 |

导出类型、重载与参数说明见上述源码及随包声明；公开子路径以 package.json 的 exports 为准。

## 行为与集成约束

这是私有工作区工具，应通过 workspace:* 使用，不作为 npm 运行时依赖。getRslibConfig 返回异步配置工厂，并从构建工作目录读取 package.json。writeCode 在内容未变化时保留修改时间。

## 测试与开发

```sh
pnpm --filter @1adybug/build-config test
```

独立包构建和 ESM/CJS 消费、声明错误失败、构建目标与 React 检测、导出过滤和稳定输出。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

私有工作区工具，不发布到 npm。
