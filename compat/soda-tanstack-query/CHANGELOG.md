# soda-tanstack-query

## 0.0.17

### Patch Changes

- 74745f1: 根据当前公开 API 重写中英文 README，补全安装、入口、使用方式、运行环境与边界说明。扩展函数、组件、CLI、兼容入口及类型工具的行为和类型契约测试，并将中文文档包含在发布包中。
- cc1a084: 将旧名称改为对应 @1adybug 实现包的兼容入口，保留公开导出、默认导出、已声明子路径和 CLI 命令。业务实现只维护在新作用域包中，旧入口转发到同一份实现，持久化键与已有文件配置约定保持兼容。
- Updated dependencies [74745f1]
- Updated dependencies [cc1a084]
    - @1adybug/tanstack-query@0.0.17

## 0.0.16

### Patch Changes

- feat: update dependencies

## 0.0.15

### Patch Changes

- fix: 移除弃用的 baseUrl 字段

## 0.0.14

### Patch Changes

- 修复类型推导失效的问题

## 0.0.13

### Patch Changes

- 允许选项为空

## 0.0.12

### Patch Changes

- 新增 createUseMutation

## 0.0.11

### Patch Changes

- 修复 refine 类型错误

## 0.0.10

### Patch Changes

- @tanstack/react-query 移到 peerDependencies 中

## 0.0.9

### Patch Changes

- 修复 @tanstack/react-query 版本不一致的问题

## 0.0.8

### Patch Changes

- 修复 useQuery 没有被返回的问题

## 0.0.7

### Patch Changes

- 新增 Assign 工具类型，新增 refine 方法允许再次定义 hook

## 0.0.6

### Patch Changes

- 优化 FlattenZodError 使用方式，将 schema 错误的连接符改为 / ，将 IsParamRequired 移动到 soda-type 中

## 0.0.5

### Patch Changes

- 修复文本错误

## 0.0.4

### Patch Changes

- 移除意外导出的内部类型

## 0.0.3

### Patch Changes

- 支持创建时传递 select 参数

## 0.0.2

### Patch Changes

- 修复了创建时传递了 initialData 后续还需要传递的问题

## 0.0.1

### Patch Changes

- init
