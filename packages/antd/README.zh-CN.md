# @1adybug/antd

[English](README.md) | [简体中文](README.zh-CN.md)

Ant Design 扩展工具，提供类型化选择、选项搜索、表单订阅、树过滤、表格尺寸和工作表导出。

## 能力

- EnumSelect、NiceSearch、按组件限定的 Theme 配置和 FormSubscribe。
- Zod 校验规则、树状态投影、滚动区域测量、日期范围和表格渲染值导出。

## 安装与运行环境

```sh
pnpm add @1adybug/antd
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

| Peer 依赖          | 工作区范围 |
| ------------------ | ---------- |
| `@types/react`     | `^19.3.0`  |
| `@types/react-dom` | `^19.3.0`  |
| `antd`             | `^6.6.8`   |
| `react`            | `^19.3.1`  |
| `react-dom`        | `^19.3.1`  |
| `zod`              | `^4.6.7`   |

## 快速开始

```tsx
import { EnumSelect, Theme } from "@1adybug/antd"

const Status = { Ready: "ready", Idle: "idle" } as const

function StatusSelect() {
    return (
        <Theme.Select colorPrimary="#2563eb">
            <EnumSelect enumObject={Status} allowClear onChange={value => console.log(value)} />
        </Theme.Select>
    )
}
```

## 公开 API

| 模块                                                                 | 导出                                                                                                                                                          |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/components/EnumSelect.tsx](src/components/EnumSelect.tsx)       | `SelectOptions`, `EnumValue`, `SelectValue`, `EnumOption`, `EnumSelectProps`, `EnumSelect`, `EnumSelectComponent`, `createEnumSelect`                         |
| [src/components/FormSubscribe.tsx](src/components/FormSubscribe.tsx) | `FormSubscribeProps`, `FormSubscribe`                                                                                                                         |
| [src/components/NiceSearch.tsx](src/components/NiceSearch.tsx)       | `NiceSearchOption`, `NiceSearchFilterItem`, `NiceSearchSearchConfig`, `NiceSearchProps`, `NiceSearch`                                                         |
| [src/components/Theme.tsx](src/components/Theme.tsx)                 | `ComponentsConfig`, `ThemeComponentProps`, `ThemeMap`, `Theme`                                                                                                |
| [src/hooks/useFilterTree.ts](src/hooks/useFilterTree.ts)             | `BasicTreeDataNode`, `TreeDataNode`, `SelectInfo`, `NodePosition`, `CheckInfo`, `UseFilterTreeParams`, `FilterTreeProps`, `CheckedKeys`, `useFilterTreeProps` |
| [src/hooks/useScroll.ts](src/hooks/useScroll.ts)                     | `UseScrollOptions`, `useScroll`                                                                                                                               |
| [src/types/index.ts](src/types/index.ts)                             | `Column`, `Columns`, `EditorProps`                                                                                                                            |
| [src/utils/aclsm.ts](src/utils/aclsm.ts)                             | `aclsm`                                                                                                                                                       |
| [src/utils/getTimeRange.ts](src/utils/getTimeRange.ts)               | `getTimeRange`                                                                                                                                                |
| [src/utils/getWorkSheet.ts](src/utils/getWorkSheet.ts)               | `GetWorkSheetParams`, `getWorkSheet`                                                                                                                          |
| [src/utils/schemaToRule.ts](src/utils/schemaToRule.ts)               | `schemaToRuleParams`, `schemaToRule`                                                                                                                          |

导出类型、重载与参数说明见上述源码及随包声明；公开子路径以 package.json 的 exports 为准。

## 行为与集成约束

与宿主应用使用同一份 React 和 Ant Design。schemaToRule 需要兼容的 Zod。选择器通常会清除不可用值，loading 或 allowUnavailableValue 可禁用这一行为。useFilterTreeProps 保留完整树状态，并返回过滤后的投影。

## 测试与开发

```sh
pnpm --filter @1adybug/antd... build
pnpm --filter @1adybug/antd test
pnpm --filter @1adybug/antd test:types
```

选择过滤及失效值处理、搜索回调、Theme 范围、表单订阅、树勾选与无输入污染的选择、滚动测量、Schema 失败、日期边界与渲染工作表。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

MIT.
