# @1adybug/react

React 节点与表格值转换工具，提供 `isReactNode`、`renderToText` 和 `renderToWorkSheetCell`。

```ts
import { isReactNode, renderToWorkSheetCell } from "@1adybug/react"

isReactNode(["text", 1, null])
renderToWorkSheetCell(9007199254740993n)
```

`renderToText` 处理元素时需要浏览器的 DOMParser。旧名称 `soda-react` 保留为兼容入口，详见根目录 [迁移说明](../../MIGRATION.md)。
