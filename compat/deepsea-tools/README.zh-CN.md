# deepsea-tools

[English](README.md) | [简体中文](README.zh-CN.md)

提供 `@1adybug/tools` 的兼容包名入口。通用 TypeScript 工具集，涵盖解析、集合、请求中间件、浏览器存储、电子表格、几何与动画。

## 安装

```sh
pnpm add deepsea-tools
```

## 使用与入口

使用方式和行为契约见 [实现包文档](../../packages/tools/README.zh-CN.md)。将示例中的包名替换为 `deepsea-tools`，其子路径按同名入口转发。

| 公开子路径 | 转发目标         |
| ---------- | ---------------- |
| `.`        | `@1adybug/tools` |

## 运行环境与契约

本包仅转发导出，不单独维护业务状态。ESM 使用重新导出，CommonJS 入口转发目标模块对象；默认导出、类型入口与可执行命令按各入口声明提供。依赖与 peer 要求跟随实现包。

## 测试与开发

```sh
pnpm --filter deepsea-tools... build
pnpm --filter deepsea-tools test
pnpm --filter deepsea-tools test:types
```

验证每个显式入口的转发代码、类型声明、依赖与 peer 契约；在适用时验证 ESM 引用一致、CommonJS 模块引用一致和 CLI 帮助及版本。复杂通配入口通过代表性子路径及工作区产物检查验证。

## 许可证

MIT.
