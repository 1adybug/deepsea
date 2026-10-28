# @1adybug/react

[English](README.md) | [简体中文](README.zh-CN.md)

React 节点验证以及文本、工作表单元格转换工具。

## 能力

- 验证基本值、元素与嵌套可迭代子节点。
- 从渲染标记提取文本，并保留适用于工作表的基本值。

## 安装与运行环境

```sh
pnpm add @1adybug/react
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

| Peer 依赖          | 工作区范围 |
| ------------------ | ---------- |
| `@types/react`     | `^19.3.0`  |
| `@types/react-dom` | `^19.3.0`  |
| `react`            | `^19.3.1`  |
| `react-dom`        | `^19.3.1`  |

## 快速开始

```tsx
import { isReactNode, renderToText, renderToWorkSheetCell } from "@1adybug/react"

isReactNode(["Hello", <strong key="name">World</strong>]) // true

renderToText(<span>Hello &amp; World</span>) // "Hello & World"

renderToWorkSheetCell(42n) // "42"
```

## 公开 API

| 模块                                                                     | 导出                    |
| ------------------------------------------------------------------------ | ----------------------- |
| [src/utils/isReactNode.ts](src/utils/isReactNode.ts)                     | `isReactNode`           |
| [src/utils/renderToText.ts](src/utils/renderToText.ts)                   | `renderToText`          |
| [src/utils/renderToWorkSheetCell.ts](src/utils/renderToWorkSheetCell.ts) | `renderToWorkSheetCell` |

导出类型、重载与参数说明见上述源码及随包声明；公开子路径以 package.json 的 exports 为准。

## 行为与集成约束

标记到文本转换使用 DOMParser，需要浏览器或提供 DOM 的环境。`isReactNode` 不识别 Promise 子节点。单元格转换保留数字和布尔值，将 bigint 转成字符串，不支持的值返回空字符串。

## 测试与开发

```sh
pnpm --filter @1adybug/react... build
pnpm --filter @1adybug/react test
pnpm --filter @1adybug/react test:types
```

基本值、嵌套可迭代对象、无效值、标记转义、bigint 转换和无效子节点诊断。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

MIT.
