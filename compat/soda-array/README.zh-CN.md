# soda-array

[English](README.md) | [简体中文](README.zh-CN.md)

提供 `@1adybug/array` 的兼容包名入口。提供类型完备的独立数组函数、现代 Array 方法补全，以及可选的原型扩展。

## 安装

```sh
pnpm add soda-array
```

## 使用与入口

使用方式和行为契约见 [实现包文档](../../packages/array/README.zh-CN.md)。将示例中的包名替换为 `soda-array`，其子路径按同名入口转发。

| 公开子路径                      | 转发目标                                     |
| ------------------------------- | -------------------------------------------- |
| `.`                             | `@1adybug/array`                             |
| `./types`                       | `@1adybug/array/types`                       |
| `./auto`                        | `@1adybug/array/auto`                        |
| `./pure`                        | `@1adybug/array/pure`                        |
| `./virtual`                     | `@1adybug/array/virtual`                     |
| `./es`                          | `@1adybug/array/es`                          |
| `./es/array`                    | `@1adybug/array/es/array`                    |
| `./pure/es`                     | `@1adybug/array/pure/es`                     |
| `./pure/es/array`               | `@1adybug/array/pure/es/array`               |
| `./pure/es/virtual`             | `@1adybug/array/pure/es/virtual`             |
| `./pure/es/array/virtual`       | `@1adybug/array/pure/es/array/virtual`       |
| `./es/virtual`                  | `@1adybug/array/es/virtual`                  |
| `./es/array/virtual`            | `@1adybug/array/es/array/virtual`            |
| `./stable`                      | `@1adybug/array/stable`                      |
| `./stable/array`                | `@1adybug/array/stable/array`                |
| `./pure/stable`                 | `@1adybug/array/pure/stable`                 |
| `./pure/stable/array`           | `@1adybug/array/pure/stable/array`           |
| `./pure/stable/virtual`         | `@1adybug/array/pure/stable/virtual`         |
| `./pure/stable/array/virtual`   | `@1adybug/array/pure/stable/array/virtual`   |
| `./stable/virtual`              | `@1adybug/array/stable/virtual`              |
| `./stable/array/virtual`        | `@1adybug/array/stable/array/virtual`        |
| `./actual`                      | `@1adybug/array/actual`                      |
| `./actual/array`                | `@1adybug/array/actual/array`                |
| `./pure/actual`                 | `@1adybug/array/pure/actual`                 |
| `./pure/actual/array`           | `@1adybug/array/pure/actual/array`           |
| `./pure/actual/virtual`         | `@1adybug/array/pure/actual/virtual`         |
| `./pure/actual/array/virtual`   | `@1adybug/array/pure/actual/array/virtual`   |
| `./actual/virtual`              | `@1adybug/array/actual/virtual`              |
| `./actual/array/virtual`        | `@1adybug/array/actual/array/virtual`        |
| `./full`                        | `@1adybug/array/full`                        |
| `./full/array`                  | `@1adybug/array/full/array`                  |
| `./pure/full`                   | `@1adybug/array/pure/full`                   |
| `./pure/full/array`             | `@1adybug/array/pure/full/array`             |
| `./pure/full/virtual`           | `@1adybug/array/pure/full/virtual`           |
| `./pure/full/array/virtual`     | `@1adybug/array/pure/full/array/virtual`     |
| `./full/virtual`                | `@1adybug/array/full/virtual`                |
| `./full/array/virtual`          | `@1adybug/array/full/array/virtual`          |
| `./features`                    | `@1adybug/array/features`                    |
| `./features/array`              | `@1adybug/array/features/array`              |
| `./pure/features`               | `@1adybug/array/pure/features`               |
| `./pure/features/array`         | `@1adybug/array/pure/features/array`         |
| `./pure/features/virtual`       | `@1adybug/array/pure/features/virtual`       |
| `./pure/features/array/virtual` | `@1adybug/array/pure/features/array/virtual` |
| `./features/virtual`            | `@1adybug/array/features/virtual`            |
| `./features/array/virtual`      | `@1adybug/array/features/array/virtual`      |

通配子路径与实现包的入口族保持一致，包括 pure、virtual、auto 以及对应的 .js 形式。

## 运行环境与契约

本包仅转发导出，不单独维护业务状态。ESM 使用重新导出，CommonJS 入口转发目标模块对象；默认导出、类型入口与可执行命令按各入口声明提供。依赖与 peer 要求跟随实现包。

## 测试与开发

```sh
pnpm --filter soda-array... build
pnpm --filter soda-array test
pnpm --filter soda-array test:types
```

验证每个显式入口的转发代码、类型声明、依赖与 peer 契约；在适用时验证 ESM 引用一致、CommonJS 模块引用一致和 CLI 帮助及版本。复杂通配入口通过代表性子路径及工作区产物检查验证。

## 许可证

MIT.
