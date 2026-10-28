---
"@1adybug/components": patch
"@1adybug/tools": patch
"@1adybug/store": patch
"@1adybug/next-cli": patch
"@1adybug/react-router-cli": patch
"@1adybug/antd": patch
"@1adybug/array": patch
"@1adybug/coordinate": patch
"@1adybug/heroui": patch
"@1adybug/hooks": patch
"@1adybug/next": patch
"@1adybug/node": patch
"@1adybug/react": patch
"@1adybug/react-router": patch
"@1adybug/tailwind": patch
"@1adybug/tanstack-form": patch
"@1adybug/tanstack-query": patch
"@1adybug/types": patch
---

统一兼容范围内的依赖版本与 Node 24 类型，使用共享构建配置，补齐包级回归和类型测试。修复公开声明引用 @1adybug/types 时缺失的运行依赖，以及 React Router 集成中缺失的 React peer dependency；适配 Ant Design 6 表单订阅 selector 的类型契约。
