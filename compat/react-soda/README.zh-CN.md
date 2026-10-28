# react-soda

[English](README.md) | [简体中文](README.zh-CN.md)

提供 `@1adybug/store` 的兼容包名入口。轻量 React 外部状态库，支持选择器、订阅、不可变对象更新和可选持久化。

## 安装

```sh
pnpm add react-soda
```

## 使用与入口

使用方式和行为契约见 [实现包文档](../../packages/store/README.zh-CN.md)。将示例中的包名替换为 `react-soda`，其子路径按同名入口转发。

| 公开子路径 | 转发目标         |
| ---------- | ---------------- |
| `.`        | `@1adybug/store` |

## 运行环境与契约

本包仅转发导出，不单独维护业务状态。ESM 使用重新导出，CommonJS 入口转发目标模块对象；默认导出、类型入口与可执行命令按各入口声明提供。依赖与 peer 要求跟随实现包。

## 测试与开发

```sh
pnpm --filter react-soda... build
pnpm --filter react-soda test
pnpm --filter react-soda test:types
```

验证每个显式入口的转发代码、类型声明、依赖与 peer 契约；在适用时验证 ESM 引用一致、CommonJS 模块引用一致和 CLI 帮助及版本。复杂通配入口通过代表性子路径及工作区产物检查验证。

## 许可证

MIT.
