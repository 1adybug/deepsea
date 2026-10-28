# Deepsea Playground

[English](README.md) | [简体中文](README.zh-CN.md)

使用工作区真实库进行手动交互和视觉验证的私有 React 应用，基于 Rsbuild 构建。当前示例展示 ScrollMask。

## 启动

```sh
# From the repository root
pnpm install --frozen-lockfile
pnpm dev
```

## 开发

修改 src/App.tsx 添加示例，公共文件位于 public/。dev 命令先构建依赖包，再监听应用。无需将 playground 作为依赖安装。

## 验证

```sh
pnpm --filter @1adybug/playground test
pnpm --filter @1adybug/playground test:types
pnpm --filter @1adybug/playground build
```

自动测试挂载真实组件，检查关键 DOM 及观察器清理。浏览器视觉、滚动表现、媒体编解码和真实设备交互仍需人工验证。运行条件与完整命令见 [仓库说明](../../README.zh-CN.md)。
