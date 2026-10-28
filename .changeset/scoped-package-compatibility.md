---
"deepsea-components": patch
"deepsea-tools": patch
"react-soda": patch
"sdnext": patch
"sdrr": patch
"soda-antd": patch
"soda-array": patch
"soda-coordinate": patch
"soda-heroui": patch
"soda-hooks": patch
"soda-next": patch
"soda-nodejs": patch
"soda-react": patch
"soda-react-router": patch
"soda-tailwind": patch
"soda-tanstack-form": patch
"soda-tanstack-query": patch
"soda-type": patch
---

将旧名称改为对应 @1adybug 实现包的兼容入口，保留公开导出、默认导出、已声明子路径和 CLI 命令。业务实现只维护在新作用域包中，旧入口转发到同一份实现，持久化键与已有文件配置约定保持兼容。
