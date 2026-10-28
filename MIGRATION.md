# 作用域包迁移

实现包统一使用 `@1adybug/*`。旧名称保留为 `compat/` 中的兼容包，依赖对应的新包并转发公开 API，关系类似 `react-router-dom` 到 `react-router` 的转发入口。业务代码只维护在 `packages/`，禁止实现包反向依赖兼容包。

| 旧包（兼容入口）      | 新包（实现）                |
| --------------------- | --------------------------- |
| `deepsea-tools`       | `@1adybug/tools`            |
| `deepsea-components`  | `@1adybug/components`       |
| `react-soda`          | `@1adybug/store`            |
| `soda-type`           | `@1adybug/types`            |
| `soda-nodejs`         | `@1adybug/node`             |
| `soda-array`          | `@1adybug/array`            |
| `soda-coordinate`     | `@1adybug/coordinate`       |
| `soda-hooks`          | `@1adybug/hooks`            |
| `soda-react`          | `@1adybug/react`            |
| `soda-antd`           | `@1adybug/antd`             |
| `soda-heroui`         | `@1adybug/heroui`           |
| `soda-next`           | `@1adybug/next`             |
| `soda-react-router`   | `@1adybug/react-router`     |
| `soda-tailwind`       | `@1adybug/tailwind`         |
| `soda-tanstack-form`  | `@1adybug/tanstack-form`    |
| `soda-tanstack-query` | `@1adybug/tanstack-query`   |
| `sdnext`              | `@1adybug/next-cli`         |
| `sdrr`                | `@1adybug/react-router-cli` |

`@1adybug/xlsx` 已使用作用域，不新增重复兼容包。私有包也统一为 `@1adybug/playground`、`@1adybug/build-config`、`@1adybug/typescript-config`，根私有包为 `@1adybug/deepsea`。

## 使用新包

当前改造保存在工作区，尚未发布。新作用域版本发布后，外部项目可同时替换依赖与 import：

```sh
pnpm remove deepsea-tools soda-hooks react-soda
pnpm add @1adybug/tools @1adybug/hooks @1adybug/store
```

```ts
import { useStableEffect } from "@1adybug/hooks"
import createStore, { createPersistentStore } from "@1adybug/store"
import { getPagination } from "@1adybug/tools"
```

`react-soda` 的默认导出与命名导出同时保留。新旧入口并存时应使用匹配版本，才能解析到同一份实现。

## 子路径与 CLI

- `soda-hooks/eslint` 转发到 `@1adybug/hooks/eslint`，包含默认 ESLint 配置。
- `soda-array/types` 转发到 `@1adybug/array/types`，继续提供 Array 全局类型扩展。
- `sdrr/vite`、`sdrr/rsbuild` 分别转发到 `@1adybug/react-router-cli/vite`、`@1adybug/react-router-cli/rsbuild`。
- `sdrr` 和 `sdnext` 命令名保留。新 CLI 包提供相同命令，旧 CLI 包通过执行新包的 CLI 入口转发。
- `sdrr`、`sdnext` 的配置文件名、生成文件约定和参数不因 npm 包改名而变化。
- `@1adybug/store` 继续使用 `react-soda-*` 存储键，读取已有持久化数据。

## 维护与发布

兼容包的 `compatibility` 元数据声明目标、默认导出、类型专用入口和 CLI。`scripts/build-compat.mjs` 只生成 ESM / CJS / 声明 / CLI 转发，不复制业务源码。Turborepo 先构建实现，再构建和测试兼容层。

兼容测试覆盖新旧导出的引用一致性、CommonJS 模块对象一致性、默认导出、已有子路径、类型契约和旧 CLI 的帮助及版本输出。新增公开子路径时，需同步兼容包的 `exports`并通过 `pnpm check`。

Changesets 分别记录实现包与旧包的变更；内部使用 `workspace:*`，打包时由 pnpm 转换为实际版本。历史 CHANGELOG 中的旧名称作为历史记录保留。
