# react-soda

## 5.3.9

### Patch Changes

- 74745f1: 根据当前公开 API 重写中英文 README，补全安装、入口、使用方式、运行环境与边界说明。扩展函数、组件、CLI、兼容入口及类型工具的行为和类型契约测试，并将中文文档包含在发布包中。
- cc1a084: 将旧名称改为对应 @1adybug 实现包的兼容入口，保留公开导出、默认导出、已声明子路径和 CLI 命令。业务实现只维护在新作用域包中，旧入口转发到同一份实现，持久化键与已有文件配置约定保持兼容。
- Updated dependencies [74745f1]
- Updated dependencies [cc1a084]
    - @1adybug/store@5.3.9

## 5.3.8

### Patch Changes

- feat: update dependencies

## 5.3.7

### Patch Changes

- fix: 移除弃用的 baseUrl 字段

## 5.3.6

### Patch Changes

- 升级依赖

## 5.3.5

### Patch Changes

- 优化代码

## 5.3.4

### Patch Changes

- update dependencies

## 5.3.3

### Patch Changes

- update dependencies

## 5.3.2

### Patch Changes

- 新增 useEventListener，升级 react 最低版本至 19.2.0

## 5.3.1

### Patch Changes

- 升级依赖

## 5.3.0

### Minor Changes

- 移除 react compiler

## 5.2.1

### Patch Changes

- 升级依赖

## 5.2.0

### Minor Changes

- 迁移到 rslib

## 5.1.6

### Patch Changes

- 更新 TypeScript 字段

## 5.1.5

### Patch Changes

- 将 Column 类型移动到 soda-antd 包中，升级 react 相关依赖

## 5.1.4

### Patch Changes

- 修复导出方式

## 5.1.3

### Patch Changes

- 修复导出方式

## 5.1.2

### Patch Changes

- 修复导出方式

## 5.1.1

### Patch Changes

- 修复 ExportExcel 没有被导出的错误

## 5.1.0

### Minor Changes

- 添加参数 getServerSnapshot，用于支持服务端渲染

## 5.0.10

### Patch Changes

- 更新路径别名，统一使用 @ 符号引入模块

## 5.0.9

### Patch Changes

- 将 father 迁移到公共开发依赖

## 5.0.8

### Patch Changes

- 修复一些字段

## 5.0.7

### Patch Changes

- 修复发布时版本问题
