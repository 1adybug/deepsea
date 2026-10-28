# soda-array

## 0.2.0

### Minor Changes

- 3551c60: 使用 core-js / core-js-pure 补齐 Array 的标准方法和公开提案入口，保留同步 extendArrayPrototype 及原有自定义扩展。新增按方法、profile、pure、virtual 和 auto 入口，旧 soda-array 镜像转发全部能力。

    修正稀疏数组分块、标准索引转换、省略参数与 undefined 区别、复制方法和负索引交换语义。补齐所有操作、独立进程隔离、缺失原生方法、生产打包副作用和新旧包类型契约测试。

### Patch Changes

- 74745f1: 根据当前公开 API 重写中英文 README，补全安装、入口、使用方式、运行环境与边界说明。扩展函数、组件、CLI、兼容入口及类型工具的行为和类型契约测试，并将中文文档包含在发布包中。
- cc1a084: 统一兼容范围内的依赖版本与 Node 24 类型，使用共享构建配置，补齐包级回归和类型测试。修复公开声明引用 @1adybug/types 时缺失的运行依赖，以及 React Router 集成中缺失的 React peer dependency；适配 Ant Design 6 表单订阅 selector 的类型契约。

## 0.1.10

### Patch Changes

- feat: update dependencies

## 0.1.9

### Patch Changes

- fix: 移除弃用的 baseUrl 字段

## 0.1.8

### Patch Changes

- fix(soda-array): 导出 types 子路径以支持 reference types

## 0.1.7

### Patch Changes

- 修复类型文件没有被使用的问题

## 0.1.6

### Patch Changes

- 升级依赖

## 0.1.5

### Patch Changes

- 优化代码

## 0.1.4

### Patch Changes

- update dependencies

## 0.1.3

### Patch Changes

- update dependencies

## 0.1.2

### Patch Changes

- 升级依赖

## 0.1.1

### Patch Changes

- 升级依赖

## 0.1.0

### Minor Changes

- 迁移到 rslib

## 0.0.8

### Patch Changes

- 更新 TypeScript 字段

## 0.0.7

### Patch Changes

- 修复导出方式

## 0.0.6

### Patch Changes

- 修复导出方式

## 0.0.5

### Patch Changes

- 修复导出方式

## 0.0.4

### Patch Changes

- 修复 ExportExcel 没有被导出的错误

## 0.0.3

### Patch Changes

- 更新路径别名，统一使用 @ 符号引入模块
