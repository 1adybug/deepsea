# Deepsea

[English](README.md) | [简体中文](README.zh-CN.md)

Deepsea 是一个面向 JavaScript 和 TypeScript 的模块化工具库仓库，包含数据处理、React 状态与交互、UI 集成、路由生成和 Node.js 工具。各库可以独立安装，通过明确的包入口、类型声明和共享构建工具协作。

## 目录

- [选择包](#选择包)
- [安装与使用](#安装与使用)
- [工作区开发](#工作区开发)
- [测试与质量](#测试与质量)
- [包格式与兼容入口](#包格式与兼容入口)
- [贡献与发布](#贡献与发布)
- [许可证](#许可证)

## 选择包

| 包                                                                       | 用途                                                                                                 |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| [`@1adybug/array`](packages/array/README.zh-CN.md)                       | 提供类型完备的独立数组函数、现代 Array 方法补全，以及可选的原型扩展。                                |
| [`@1adybug/tools`](packages/tools/README.zh-CN.md)                       | 通用 TypeScript 工具集，涵盖解析、集合、请求中间件、浏览器存储、电子表格、几何与动画。               |
| [`@1adybug/types`](packages/types/README.zh-CN.md)                       | 编译期 TypeScript 类型工具，支持联合类型分析、严格对象变换、元组索引、函数参数和查询模型。           |
| [`@1adybug/store`](packages/store/README.zh-CN.md)                       | 轻量 React 外部状态库，支持选择器、订阅、不可变对象更新和可选持久化。                                |
| [`@1adybug/hooks`](packages/hooks/README.zh-CN.md)                       | React Hook 工具集，涵盖外部存储、类型化 URL 状态、DOM 副作用、元素测量、交互、媒体与浏览器生命周期。 |
| [`@1adybug/react`](packages/react/README.zh-CN.md)                       | React 节点验证以及文本、工作表单元格转换工具。                                                       |
| [`@1adybug/components`](packages/components/README.zh-CN.md)             | 可复用 React 组件，覆盖尺寸驱动布局、滚动、文件流程、图表、媒体和视觉基础元素。                      |
| [`@1adybug/coordinate`](packages/coordinate/README.zh-CN.md)             | 经纬度表示、WGS84/GCJ02/BD09 坐标转换与几何工具。                                                    |
| [`@1adybug/node`](packages/node/README.zh-CN.md)                         | Node.js 文件、响应流、子进程与归档工具。                                                             |
| [`@1adybug/antd`](packages/antd/README.zh-CN.md)                         | Ant Design 扩展工具，提供类型化选择、选项搜索、表单订阅、树过滤、表格尺寸和工作表导出。              |
| [`@1adybug/heroui`](packages/heroui/README.zh-CN.md)                     | 面向 TanStack Form 的 HeroUI 表单适配器与选择工具，包含日期时间转换、错误展示和 Toast 工具。         |
| [`@1adybug/tanstack-form`](packages/tanstack-form/README.zh-CN.md)       | 在 TanStack Form 字段上下文与可复用 React 字段组件之间提供轻量类型化桥接。                           |
| [`@1adybug/tanstack-query`](packages/tanstack-query/README.zh-CN.md)     | 用于创建可复用 TanStack Query 查询与变更 Hook 的类型化工厂。                                         |
| [`@1adybug/next`](packages/next/README.zh-CN.md)                         | 用于 Next.js App Router 查询状态与声明式导航的 React 工具。                                          |
| [`@1adybug/react-router`](packages/react-router/README.zh-CN.md)         | 面向 React Router 应用的类型化 URL 查询状态 Hook。                                                   |
| [`@1adybug/react-router-cli`](packages/react-router-cli/README.zh-CN.md) | 用于 React Router 的文件系统路由生成器，提供 CLI 及 Vite、Rsbuild 开发集成。                         |
| [`@1adybug/next-cli`](packages/next-cli/README.zh-CN.md)                 | 从共享模块生成 Next.js 服务端 Action、Action 路由注册表及客户端查询与变更 Hook 的项目 CLI。          |
| [`@1adybug/tailwind`](packages/tailwind/README.zh-CN.md)                 | 为 Tailwind CSS 3 提供弹性填充、两端对齐文本和完整背景尺寸的插件。                                   |
| [`@1adybug/xlsx`](packages/xlsx/README.zh-CN.md)                         | 基于随包提供的 SheetJS 运行时代码解析和写入电子表格，提供工作簿工具及 Node、浏览器入口。             |

## 安装与使用

仅安装需要的包，并按各包文档配置 peer 依赖。仓库根包为私有工作区，不是统一的运行时入口。

```sh
pnpm add @1adybug/array @1adybug/tools
```

```ts
import { chunk } from "@1adybug/array"
import { createRequestFn, intParser } from "@1adybug/tools"

const groups = chunk([1, 2, 3, 4, 5], 2)
const page = intParser("2") ?? 1

const load = createRequestFn(async (id: number) => ({
    success: true,
    data: { id },
}))

const item = await load(1)
```

数组根入口使用纯函数；需要扩展全局 Array 时才显式导入 auto。React 包应使用宿主的 React 与 UI/路由实例。浏览器存储、DOM、动画和媒体功能需在浏览器环境使用；Node 与 CLI 包在 Node 中运行。

## 工作区开发

开发要求：Node.js >=24.15.0 且 <25，pnpm 11.10.0。版本约束位于 package.json 和 .node-version。

```sh
git clone https://github.com/1adybug/deepsea.git
cd deepsea
pnpm install --frozen-lockfile
pnpm build:packages
pnpm dev
```

```text
deepsea/
  packages/   # independently installable libraries and CLIs
  compat/     # forwarding package-name entries
  tooling/    # private build and TypeScript presets
  apps/       # interactive playground
  tests/      # shared browser, compatibility and spreadsheet tests
  scripts/    # workspace validation, artifacts and release support
```

| 命令                  | 用途                                           |
| --------------------- | ---------------------------------------------- |
| `pnpm dev`            | 监听 playground 及其工作区依赖                 |
| `pnpm build`          | 按依赖顺序构建所有包与 playground              |
| `pnpm build:packages` | 构建发布包和兼容入口                           |
| `pnpm test`           | 执行全部 40 个工作区包的测试及构建前置任务     |
| `pnpm test:types`     | 编译运行时测试及类型契约用例                   |
| `pnpm test:coverage`  | 为自有 TypeScript 库和 playground 生成 V8 报告 |
| `pnpm check`          | 检查边界、格式、Lint、类型、测试、构建和产物   |
| `pnpm clean`          | 移除生成的工作区产物                           |

## 测试与质量

测试按公开 API 的职责选择场景：函数验证输入、输出、边界和失败；组件验证渲染、交互、更新和卸载；类型工具通过编译器验证推导和错误用法；CLI 在临时项目中验证生成、监听和清理；兼容包验证真实入口、声明和共享引用。共享实现的别名复用行为测试，并检查入口一致性。

详见 [测试指南](TESTING.zh-CN.md)。覆盖率报告用于寻找遗漏，不代表浏览器视觉、真实媒体网络、设备交互或所有上游库行为已经通过验收。CI 在 Windows 和 Linux 上运行完整检查。

## 包格式与兼容入口

大多数运行时库提供 ESM、CommonJS 和 TypeScript 声明；Node 生成器及 CLI 以 ESM 为主，XLSX 保留专用浏览器与编码入口。请通过 package.json 声明的 exports 导入。

| 兼容包名                                                            | 实现包                      |
| ------------------------------------------------------------------- | --------------------------- |
| [`deepsea-components`](compat/deepsea-components/README.zh-CN.md)   | `@1adybug/components`       |
| [`deepsea-tools`](compat/deepsea-tools/README.zh-CN.md)             | `@1adybug/tools`            |
| [`react-soda`](compat/react-soda/README.zh-CN.md)                   | `@1adybug/store`            |
| [`sdnext`](compat/sdnext/README.zh-CN.md)                           | `@1adybug/next-cli`         |
| [`sdrr`](compat/sdrr/README.zh-CN.md)                               | `@1adybug/react-router-cli` |
| [`soda-antd`](compat/soda-antd/README.zh-CN.md)                     | `@1adybug/antd`             |
| [`soda-array`](compat/soda-array/README.zh-CN.md)                   | `@1adybug/array`            |
| [`soda-coordinate`](compat/soda-coordinate/README.zh-CN.md)         | `@1adybug/coordinate`       |
| [`soda-heroui`](compat/soda-heroui/README.zh-CN.md)                 | `@1adybug/heroui`           |
| [`soda-hooks`](compat/soda-hooks/README.zh-CN.md)                   | `@1adybug/hooks`            |
| [`soda-next`](compat/soda-next/README.zh-CN.md)                     | `@1adybug/next`             |
| [`soda-nodejs`](compat/soda-nodejs/README.zh-CN.md)                 | `@1adybug/node`             |
| [`soda-react`](compat/soda-react/README.zh-CN.md)                   | `@1adybug/react`            |
| [`soda-react-router`](compat/soda-react-router/README.zh-CN.md)     | `@1adybug/react-router`     |
| [`soda-tailwind`](compat/soda-tailwind/README.zh-CN.md)             | `@1adybug/tailwind`         |
| [`soda-tanstack-form`](compat/soda-tanstack-form/README.zh-CN.md)   | `@1adybug/tanstack-form`    |
| [`soda-tanstack-query`](compat/soda-tanstack-query/README.zh-CN.md) | `@1adybug/tanstack-query`   |
| [`soda-type`](compat/soda-type/README.zh-CN.md)                     | `@1adybug/types`            |

内部构建预设见 [build-config](tooling/build-config/README.zh-CN.md)、[typescript-config](tooling/typescript-config/README.zh-CN.md)；交互示例见 [playground](apps/playground/README.zh-CN.md)。

## 贡献与发布

修复应定位原始状态或执行逻辑，并添加有区分力的回归用例。提交前运行 pnpm check，公共行为变化需同步中英文文档。依赖版本由根 catalog 管理，包间使用 workspace:*。使用 pnpm changeset 记录公共变化，pnpm version:packages 更新版本；pnpm release 运行完整检查后执行 Changesets 发布。发布阶段复用已验证的构建产物，跳过包级发布生命周期脚本，避免并发重建清理其他包正在读取的类型声明。

## 许可证

各库和兼容入口的包元数据声明 MIT；电子表格包 @1adybug/xlsx 使用 Apache-2.0，详见其 [LICENSE](packages/xlsx/LICENSE)。私有仓库根包元数据声明 ISC。分发时应遵循所用包及其第三方依赖的许可证。
