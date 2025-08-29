# deepsea-tools

## 5.42.0

### Minor Changes

- 新增 debugLog 和 StrKeyOf 方法，修复一些问题

### Patch Changes

- Updated dependencies
    - soda-type@6.5.0

## 5.41.1

### Patch Changes

- Updated dependencies
    - soda-type@6.4.0

## 5.41.0

### Minor Changes

- 移除 clsx 对 classNames 合并的支持，新增 clsm 对 classNames 合并的支持，支持设置触发拖动的元素，优化类型提示

## 5.40.6

### Patch Changes

- 修复 clsx 在 classNames 合并时的类型问题

## 5.40.5

### Patch Changes

- clsx 支持 classNames 对象的合并

## 5.40.4

### Patch Changes

- 升级依赖
- Updated dependencies
    - soda-type@6.3.1

## 5.40.3

### Patch Changes

- 迁移到新环境

## 5.40.2

### Patch Changes

- 允许 tree 为空的情况

## 5.40.1

### Patch Changes

- 修复 tree 可能为空的错误

## 5.40.0

### Minor Changes

- 新增 isNotEmpty 方法

## 5.39.1

### Patch Changes

- 优化 getUniqueBy 返回值函数的命名

## 5.39.0

### Minor Changes

- 新增 getUniqueBy 方法

## 5.38.2

### Patch Changes

- 升级依赖

## 5.38.1

### Patch Changes

- 升级依赖

## 5.38.0

### Minor Changes

- 新增 getAll 方法

## 5.37.0

### Minor Changes

- 新增首字母大写和小写方法

## 5.36.0

### Minor Changes

- 将中间件 context 中的 arguments 参数改为 args

## 5.35.3

### Patch Changes

- 新增 exact 参数

## 5.35.2

### Patch Changes

- 更改默认空值为 null

## 5.35.1

### Patch Changes

- 修复属性名无效的问题

## 5.35.0

### Minor Changes

- 新增 json2type 方法

## 5.34.1

### Patch Changes

- 优化 prettierError 参数

## 5.34.0

### Minor Changes

- 新增 prettierError 方法

## 5.33.0

### Minor Changes

- 新增 whileDo 函数

## 5.32.1

### Patch Changes

- Updated dependencies
    - soda-type@6.3.0

## 5.32.0

### Minor Changes

- 新增 assignFnName 和 createFnWithMiddleware 方法，修改 createRequestFn 实现

## 5.31.0

### Minor Changes

- 优化大量内容

## 5.30.0

### Minor Changes

- 启用 Excel 系列，使用 Sheet 代替

## 5.29.0

### Minor Changes

- 新增 resolveNull 方法

## 5.28.0

### Minor Changes

- 新增 isNullable 和 createRequestFn 方法

## 5.27.0

### Minor Changes

- 新增 toAdd、toDelete 方法，优化 useAutoRefresh

## 5.26.1

### Patch Changes

- 修复 soda-type 在开发依赖导致的错误

## 5.26.0

### Minor Changes

- 新增 getSample 函数

## 5.25.1

### Patch Changes

- 新增 ValueOf 类型，升级依赖

## 5.25.0

### Minor Changes

- 迁移到 rslib

## 5.24.5

### Patch Changes

- 优化日期导出

## 5.24.4

### Patch Changes

- 更新 TypeScript 字段

## 5.24.3

### Patch Changes

- 修复类型导出的错误

## 5.24.2

### Patch Changes

- 修复类型导出的错误

## 5.24.1

### Patch Changes

- 优化 Excel 相关代码

## 5.24.0

### Minor Changes

- 优化了 Excel 相关内容

## 5.23.1

### Patch Changes

- 新增类型支持

## 5.23.0

### Minor Changes

- 新增 isActiveHref 方法和 AutoNavbarItem 组件

## 5.22.0

### Minor Changes

- 新增 isIterable 方法，优化类型

## 5.21.0

### Minor Changes

- 新增 emptyWith 方法

## 5.20.0

### Minor Changes

- 新增 swap 方法

## 5.19.3

### Patch Changes

- 修复导出方式

## 5.19.2

### Patch Changes

- 修复导出方式

## 5.19.1

### Patch Changes

- 修复导出方式

## 5.19.0

### Minor Changes

- 新增多个工具和钩子函数

## 5.18.2

### Patch Changes

- 修复 CookieAttributes 没有导出的问题

## 5.18.1

### Patch Changes

- cookieStorage 支持设置选项

## 5.18.0

### Minor Changes

- 新增 isAbortError 方法

## 5.17.1

### Patch Changes

- 修复 ExportExcel 没有被导出的错误

## 5.17.0

### Minor Changes

- 修改 Excel 相关功能，新增 useSize Hook

## 5.16.7

### Patch Changes

- 修复 AND 为空时，条件却不成立的问题

## 5.16.6

### Patch Changes

- 修改 formatTime 函数以支持自定义时间格式模板

## 5.16.5

### Patch Changes

- 修复 ArrayKey 类型中 gte 和 lte 的类型推断问题

## 5.16.4

### Patch Changes

- 支持匹配模式

## 5.16.3

### Patch Changes

- 修复小于等于条件错误

## 5.16.2

### Patch Changes

- 添加 ArrayKey 类型以支持数组类型的 where 条件

## 5.16.1

### Patch Changes

- 修复属性可选时，StringKey 失败的问题

## 5.16.0

### Minor Changes

- 添加 getWhere 函数以生成 Prisma 的 where 条件

## 5.15.4

### Patch Changes

- 更新多个包的依赖版本以提升兼容性和性能

## 5.15.3

### Patch Changes

- 更新路径别名，统一使用 @ 符号引入模块

## 5.15.2

### Patch Changes

- 更新路径别名，统一使用 @ 符号引入模块

## 5.15.1

### Patch Changes

- 修复 Title 组件在服务端渲染的错误

## 5.15.0

### Minor Changes

- 新增 formatTime 函数，优化 getPagination 函数

## 5.14.1

### Patch Changes

- 升级依赖

## 5.14.0

### Minor Changes

- 新增 getEnumKeys 方法

## 5.13.0

### Minor Changes

- 新增多个方法

## 5.12.0

### Minor Changes

- 新增 color

## 5.11.0

### Minor Changes

- 新增自然数解析器

## 5.10.2

### Patch Changes

- 修复 positive 单词拼写问题

## 5.10.1

### Patch Changes

- 修复 getEnumOptions 类型问题

## 5.10.0

### Minor Changes

- 新增 getFilenameFromHeaders 方法

## 5.9.5

### Patch Changes

- 修复 getHeaders 问题

## 5.9.4

### Patch Changes

- 将 father 迁移到公共开发依赖

## 5.9.3

### Patch Changes

- 使用校验位校验身份证

## 5.9.2

### Patch Changes

- 修复 assign 错误

## 5.9.1

### Patch Changes

- 完善 assign 的逻辑

## 5.9.0

### Minor Changes

- 新增 assign 和 getEnumerable 两个方法

## 5.8.0

### Minor Changes

- 新增多个方法

## 5.7.1

### Patch Changes

- 修复一些字段

## 5.7.0

### Minor Changes

- 新增 getPagination 方法

## 5.6.1

### Patch Changes

- 修复不编译的问题

## 5.6.0

### Minor Changes

- 修改了导出

## 5.5.0

### Minor Changes

- tree 的方法变更

## 5.4.0

### Minor Changes

- 新增 isPlainObject 方法

## 5.3.0

### Minor Changes

- 新增多个方法

## 5.2.1

### Patch Changes

- getEnumKey 限制 value 只能是 enum

## 5.2.0

### Minor Changes

- 新增 getEnumKey 函数

## 5.1.0

### Minor Changes

- 新增 TransitionNum 方法

## 5.0.7

### Patch Changes

- 修复发布时版本问题

## 5.0.6

### Patch Changes

- 1233123

## 5.0.5

### Patch Changes

- ffcca50: 123123

## 5.0.4

### Patch Changes

- 121

## 5.0.3

### Patch Changes

- 082aa10: 12

## 5.0.2

### Patch Changes

- 修改版本号问题

## 5.0.1

### Patch Changes

- 8c0e7fd: 修复版本号问题

## 5.0.0

### Major Changes

- 修复打包问题

## 4.0.6

### Patch Changes

- 1

## 4.0.5

### Patch Changes

- 修复版本号问题

## 4.0.4

### Patch Changes

- 迁移到 monorepo

## 4.0.3

### Patch Changes

- 修复版本号问题

## 4.0.2

### Patch Changes

- 修复版本号问题

## 4.0.1

### Patch Changes

- 迁移到 monorepo
