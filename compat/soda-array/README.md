# soda-array

这是 [@1adybug/array](../../packages/array/README.md) 的兼容入口。实现只维护在新包中；本包同步转发全部 root、types、auto、pure、virtual、es、stable、actual、full、features 入口和按方法子路径。

新项目安装 `@1adybug/array`。已有项目可以继续调用 `extendArrayPrototype()`，也可以使用 `import "soda-array/actual/chunk"` 或 `import chunk from "soda-array/pure/chunk"`。使用示例和语义参见实现包文档。
