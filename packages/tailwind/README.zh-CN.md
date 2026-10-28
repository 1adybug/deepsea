# @1adybug/tailwind

[English](README.md) | [简体中文](README.zh-CN.md)

为 Tailwind CSS 3 提供弹性填充、两端对齐文本和完整背景尺寸的插件。

## 能力

- 带零最小尺寸的 fill-x 和 fill-y 弹性布局工具类。
- justify-text 以及 bg-full 主题扩展。

## 安装与运行环境

```sh
pnpm add @1adybug/tailwind
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

| Peer 依赖     | 工作区范围 |
| ------------- | ---------- |
| `tailwindcss` | `^3.4.19`  |

## 快速开始

```tsx
// tailwind.config.ts
import { soda } from "@1adybug/tailwind"

export default {
    content: ["./src/**/*.{ts,tsx}"],
    plugins: [soda()],
}
```

## 公开 API

| 模块                         | 导出   |
| ---------------------------- | ------ |
| [src/index.ts](src/index.ts) | `soda` |

导出类型、重载与参数说明见上述源码及随包声明；公开子路径以 package.json 的 exports 为准。

## 行为与集成约束

导出的工厂名为 soda。本包使用 Tailwind 3 的 JavaScript 插件 API。需要将类名放入扫描内容中，编译器才会生成相应工具类。

## 测试与开发

```sh
pnpm --filter @1adybug/tailwind... build
pnpm --filter @1adybug/tailwind test
pnpm --filter @1adybug/tailwind test:types
```

通过真实 PostCSS 与 Tailwind 编译验证各工具类、背景尺寸主题扩展和变体生成。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

MIT.
