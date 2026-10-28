---
"@1adybug/array": minor
"soda-array": minor
---

使用 core-js / core-js-pure 补齐 Array 的标准方法和公开提案入口，保留同步 extendArrayPrototype 及原有自定义扩展。新增按方法、profile、pure、virtual 和 auto 入口，旧 soda-array 镜像转发全部能力。

修正稀疏数组分块、标准索引转换、省略参数与 undefined 区别、复制方法和负索引交换语义。补齐所有操作、独立进程隔离、缺失原生方法、生产打包副作用和新旧包类型契约测试。
