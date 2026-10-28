# @1adybug/array

[English](README.md) | [简体中文](README.zh-CN.md)

提供类型完备的独立数组函数、现代 Array 方法补全，以及可选的原型扩展。

## 能力

- 通过 core-js 提供标准方法和异步迭代；补充数组分块、不可变更新、去重与集合运算。
- 提供 pure、virtual 与 global 等入口族，包含 ESM、CommonJS 和 TypeScript 声明。

## 安装与运行环境

```sh
pnpm add @1adybug/array
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

本包未声明 peer 依赖。

## 快速开始

```tsx
import array, { chunk, nonNullable } from "@1adybug/array"

chunk([1, 2, 3], 2) // [[1, 2], [3]]

nonNullable([0, false, null, undefined]) // [0, false]

array.toPushed([1, 2], 3) // [1, 2, 3]
```

## 公开 API

| 入口                     | 用途                       |
| ------------------------ | -------------------------- |
| `Root / pure`            | 独立方法与默认数组函数对象 |
| `auto / global families` | 可选全局安装               |
| `virtual families`       | 通过显式 this 调用的方法   |
| `types`                  | Array 环境类型声明         |

完整方法与重载见 [api.d.ts](api.d.ts)。入口族覆盖 es、stable、actual、full、features 及对应 array、pure、virtual 组合，具体以 package.json exports 为准。

## 行为与集成约束

默认入口不修改全局对象。需要全局扩展时才导入 `@1adybug/array/auto` 或调用 `extendArrayPrototype()`；`types` 入口提供环境声明。部分入口族包含提案 API，应显式选择。`asNonNullable` 仅作类型断言，不过滤值；`union` 会保留各输入中已有的重复元素。

## 测试与开发

```sh
pnpm --filter @1adybug/array... build
pnpm --filter @1adybug/array test
pnpm --filter @1adybug/array test:types
```

逐项覆盖 ArrayFunctions、稀疏数组、类数组、species、参数转换、无效输入、原型安装、纯函数与全局隔离、生成入口解析及打包。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

MIT.
