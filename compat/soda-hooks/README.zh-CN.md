# soda-hooks

[English](README.md) | [简体中文](README.zh-CN.md)

提供 `@1adybug/hooks` 的兼容包名入口。React Hook 工具集，涵盖外部存储、类型化 URL 状态、DOM 副作用、元素测量、交互、媒体与浏览器生命周期。

## 安装

```sh
pnpm add soda-hooks
```

## 使用与入口

使用方式和行为契约见 [实现包文档](../../packages/hooks/README.zh-CN.md)。将示例中的包名替换为 `soda-hooks`，其子路径按同名入口转发。

| 公开子路径 | 转发目标                |
| ---------- | ----------------------- |
| `.`        | `@1adybug/hooks`        |
| `./eslint` | `@1adybug/hooks/eslint` |

## 运行环境与契约

本包仅转发导出，不单独维护业务状态。ESM 使用重新导出，CommonJS 入口转发目标模块对象；默认导出、类型入口与可执行命令按各入口声明提供。依赖与 peer 要求跟随实现包。

## 测试与开发

```sh
pnpm --filter soda-hooks... build
pnpm --filter soda-hooks test
pnpm --filter soda-hooks test:types
```

验证每个显式入口的转发代码、类型声明、依赖与 peer 契约；在适用时验证 ESM 引用一致、CommonJS 模块引用一致和 CLI 帮助及版本。复杂通配入口通过代表性子路径及工作区产物检查验证。

## 许可证

MIT.
