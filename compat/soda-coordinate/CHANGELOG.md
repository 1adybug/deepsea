# soda-coordinate

## 5.4.3

### Patch Changes

- 74745f1: 根据当前公开 API 重写中英文 README，补全安装、入口、使用方式、运行环境与边界说明。扩展函数、组件、CLI、兼容入口及类型工具的行为和类型契约测试，并将中文文档包含在发布包中。
- cc1a084: 将旧名称改为对应 @1adybug 实现包的兼容入口，保留公开导出、默认导出、已声明子路径和 CLI 命令。业务实现只维护在新作用域包中，旧入口转发到同一份实现，持久化键与已有文件配置约定保持兼容。
- Updated dependencies [74745f1]
- Updated dependencies [cc1a084]
- Updated dependencies [74745f1]
    - @1adybug/coordinate@5.4.3

## 5.4.2

### Patch Changes

- feat(soda-hooks): 新增 useVideoStalled，优化 useCalcEffect 相关

## 5.4.1

### Patch Changes

- fix(soda-coordinate): clone Coord for same-type conversions

## 5.4.0

### Minor Changes

- feat(soda-coordinate): add flexible Coord inputs and output helpers

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

- 升级依赖

## 5.3.1

### Patch Changes

- 升级依赖

## 5.3.0

### Minor Changes

- 迁移到 rslib

## 5.2.9

### Patch Changes

- 更新 TypeScript 字段

## 5.2.8

### Patch Changes

- 修复导出方式

## 5.2.7

### Patch Changes

- 修复导出方式

## 5.2.6

### Patch Changes

- 修复导出方式

## 5.2.5

### Patch Changes

- 修复 ExportExcel 没有被导出的错误

## 5.2.4

### Patch Changes

- 更新路径别名，统一使用 @ 符号引入模块

## 5.2.3

### Patch Changes

- 将 father 迁移到公共开发依赖

## 5.2.2

### Patch Changes

- 修复一些问题

## 5.2.1

### Patch Changes

- 修复一些字段

## 5.2.0

### Minor Changes

- 修改了导出

## 5.1.1

### Patch Changes

- 修复类型声明

## 5.1.0

### Minor Changes

- 新增 robustPointInPolygon 和 robustSegmentIntersect 方法

## 5.0.7

### Patch Changes

- 修复发布时版本问题
