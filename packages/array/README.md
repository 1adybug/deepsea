# @1adybug/array

基于 `core-js` / `core-js-pure` 的完整 Array 入口，包含标准方法、core-js 收录的 Array 提案，以及原有 13 个扩展方法。提供 ESM、CommonJS 和 TypeScript 声明。旧包 `soda-array` 同步转发全部入口，业务实现只维护一份。

## 保留原有用法

```ts
import { extendArrayPrototype } from "@1adybug/array" // 也可以继续使用 soda-array

import "@1adybug/array/types"

extendArrayPrototype() // 同步、幂等安装；仅导入主入口不会修改 Array

const chunks = [1, 2, 3].chunk(2) // [[1, 2], [3]]

const exchanged = [1, 2, 3].toExchange(0, -1) // [3, 2, 1]
```

安装时使用 core-js-pure 检测并选择的标准实现，补齐构造器静态方法、原型方法、迭代器、species 与 unscopables。自定义方法保留已有同名自有属性。新增属性不可枚举，方法可写且可配置。

## core-js 风格用法

全局按需安装：

```ts
import "@1adybug/array/actual/array/to-sorted"
import "@1adybug/array/actual/chunk"

const sorted = [3, 1, 2].toSorted() // [1, 2, 3]

const chunks = [1, 2, 3].chunk(2)
```

全局集合入口：

```ts
import "@1adybug/array/actual" // 标准、当前提案、原有扩展

// import "@1adybug/array/full" // 全部，包含历史提案
// import "@1adybug/array/auto" // 等价于 full
```

不修改数组原型的 pure 函数，首个参数是接收者：

```ts
import array, { arrayWith, fromAsync } from "@1adybug/array/pure"
import map from "@1adybug/array/pure/actual/array/map.js"
import chunk from "@1adybug/array/pure/chunk"

map([1, 2], value => value * 2) // [2, 4]

chunk([1, 2, 3], 2) // [[1, 2], [3]]

array.with([1, 2], -1, 3) // [1, 3]

arrayWith([1, 2], -1, 3) // 命名导出避开 with 保留字

await fromAsync([Promise.resolve(1)]) // [1]
```

未绑定接收者的 virtual 方法：

```ts
import chunk from "@1adybug/array/pure/full/array/virtual/chunk"
import toSorted from "@1adybug/array/virtual/to-sorted"

chunk.call([1, 2, 3], 2)
toSorted.call([3, 1, 2])
```

`@1adybug/array/actual/array/virtual/chunk` 等不带 pure 的 profile virtual 入口会同时全局安装对应方法，与 core-js 的 global virtual 入口一致。

CommonJS 使用 `require("@1adybug/array/pure/chunk").default`。方法路径采用 core-js 的 kebab-case，支持有无 `.js` 后缀；主入口也导出 pure 的全部命名函数和默认命名空间。`features` 是 `full` 的别名。

## 范围

| profile             | 上游 Array 范围                            | 原有扩展 |
| ------------------- | ------------------------------------------ | -------- |
| `es` / `stable`     | 对应 core-js 的标准方法                    | 全部保留 |
| `actual`            | 对应 core-js 的标准与当前提案              | 全部保留 |
| `full` / `features` | 对应 core-js 的全部 Array 入口，含历史提案 | 全部保留 |

截至锁定的 core-js 3.51.0，full 共 66 个操作：

- 标准方法：`at`、`concat`、`copyWithin`、`entries`、`every`、`fill`、`filter`、`find`、`findIndex`、`findLast`、`findLastIndex`、`flat`、`flatMap`、`forEach`、`from`、`fromAsync`、`includes`、`indexOf`、`isArray`、`iterator`、`join`、`keys`、`lastIndexOf`、`map`、`of`、`pop`、`push`、`reduce`、`reduceRight`、`reverse`、`shift`、`slice`、`some`、`sort`、`splice`、`toLocaleString`、`toReversed`、`toSorted`、`toSpliced`、`toString`、`unshift`、`values`、`with`。
- core-js 提案：`filterOut`、`filterReject`、`group`、`groupBy`、`groupToMap`、`groupByToMap`、`isTemplateObject`、`lastIndex`、`lastItem`、`uniqueBy`。`lastIndex` / `lastItem` 在原型上是访问器，pure 中是函数；`lastItem(array, value)` 可赋值。历史提案可能不再推进，应优先使用标准 API。
- 原有扩展：`chunk`、`nonNullable`、`asNonNullable`、`toShifted`、`toPopped`、`toPushed`、`toUnshifted`、`toExchange`、`toDeduplicated`、`difference`、`intersection`、`union`、`random`。

`from`、`fromAsync`、`of`、`isArray`、`isTemplateObject` 是静态方法，其余为实例操作；`iterator` 对应 `Symbol.iterator`。基础 ES3 方法 `pop`、`shift`、`toString`、`toLocaleString` 在 core-js 中没有独立入口，使用原生未绑定函数。其余标准算法直接委托 core-js 的公开入口，不另写 polyfill。

## 扩展语义与修复

- `chunk(size)` 要求正整数，按长度分块并保留稀疏位置。
- `nonNullable()` 过滤 null / undefined；`asNonNullable()` 只收窄类型并返回原对象，保留原有契约。
- `toShifted`、`toPopped`、`toPushed`、`toUnshifted` 使用 core-js 的复制后修改语义。`toExchange` 支持负索引并按照标准规则转换索引；源数组保持不变。
- `toDeduplicated` 默认使用 SameValueZero，可去重 NaN。集合方法仍支持自定义相等比较器，传入非法比较器会抛出 TypeError。
- `difference` / `intersection` 保留左侧重复项；`union` 保留原有语义：复制左侧，追加右侧不在左侧出现的元素，右侧自身的重复项也保留。
- `random(start, end)` 使用 slice 区间，空区间抛错。

标准方法遵循 core-js / ECMAScript，包括省略参数与显式 undefined 的区别、小数索引转换、稀疏数组、species 和复制方法的普通 Array 返回值。

## 维护与验证

`scripts/generate.mjs` 从已安装 core-js 的各 profile 公开入口生成适配层、exports 和安装器。生成文件位于忽略的 `src/generated/`；构建前自动生成，内容未变时不重写，并清理生成器拥有的过期入口。Turborepo 缓存同时包含声明、运行时和生成源码，避免缓存恢复后类型检查缺文件。类型、扩展算法与测试手动维护。core-js 与 core-js-pure 在 workspace catalog 中保持相同版本。

`pnpm --filter @1adybug/array run build`、`run test`、`run test:types` 分别构建、执行行为测试和类型契约检查。声明在 ESNext、ES2020 和 NodeNext 下检查，关闭 skipLibCheck。根目录 `pnpm check` 会按依赖关系先生成发布入口，再测试；覆盖所有操作、缺失原生方法、独立进程的原型隔离、全局按需安装、生产打包保留副作用、ESM / CJS 与旧包转发。

上游参考：[core-js 使用文档](https://core-js.io/docs/usage)、[core-js 源码](https://github.com/zloirock/core-js)。

MIT
