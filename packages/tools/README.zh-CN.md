# @1adybug/tools

[English](README.md) | [简体中文](README.zh-CN.md)

通用 TypeScript 工具集，涵盖解析、集合、请求中间件、浏览器存储、电子表格、几何与动画。

## 能力

- 严格查询参数解析器、枚举工具、分页与不可变集合操作。
- 洋葱模型中间件与带 Schema 验证、成功及错误语义的请求函数。
- 可观察存储、Cookie 存储、工作表导入导出和可取消的帧调度。

## 安装与运行环境

```sh
pnpm add @1adybug/tools
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

| Peer 依赖 | 工作区范围 |
| --------- | ---------- |
| `dayjs`   | `^1.11.23` |
| `zod`     | `^4.6.7`   |

## 快速开始

```tsx
import { createRequestFn, getPagination, intParser } from "@1adybug/tools"

const page = intParser("2") ?? 1
const result = getPagination({ data: [1, 2, 3], pageNum: page, pageSize: 2 })

const load = createRequestFn(async (id: number) => ({
    success: true,
    data: { id },
}))

await load(1)
```

## 公开 API

| 模块                                                                             | 导出                                                                                                                                                                         |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/constants/index.ts](src/constants/index.ts)                                 | `digits`, `plateNoAlphabets`, `idReg`, `plateNoReg`, `plateNoRegOld`, `plateNoRegNew`, `ONE_LNG`, `ONE_LAT`, `intReg`, `uintReg`, `emailReg`, `isDev`, `isProd`, `isBrowser` |
| [src/utils/assign.ts](src/utils/assign.ts)                                       | `Combine`, `CombineAssign`, `assign`                                                                                                                                         |
| [src/utils/assignFnName.ts](src/utils/assignFnName.ts)                           | `assignFnName`                                                                                                                                                               |
| [src/utils/base64ToBlob.ts](src/utils/base64ToBlob.ts)                           | `base64ToBlob`                                                                                                                                                               |
| [src/utils/booleanParser.ts](src/utils/booleanParser.ts)                         | `booleanParser`                                                                                                                                                              |
| [src/utils/canCoordsBePolygon.ts](src/utils/canCoordsBePolygon.ts)               | `canCoordsBePolygon`                                                                                                                                                         |
| [src/utils/capitalize.ts](src/utils/capitalize.ts)                               | `capitalize`                                                                                                                                                                 |
| [src/utils/clsm.ts](src/utils/clsm.ts)                                           | `clsm`                                                                                                                                                                       |
| [src/utils/clsx.ts](src/utils/clsx.ts)                                           | `clsx`                                                                                                                                                                       |
| [src/utils/color.ts](src/utils/color.ts)                                         | `Color`, `ColorType`                                                                                                                                                         |
| [src/utils/compareProperties.ts](src/utils/compareProperties.ts)                 | `compareProperties`                                                                                                                                                          |
| [src/utils/compareWithoutProperties.ts](src/utils/compareWithoutProperties.ts)   | `compareWithoutProperties`                                                                                                                                                   |
| [src/utils/coverIdWithMosaics.ts](src/utils/coverIdWithMosaics.ts)               | `coverIdWithMosaics`                                                                                                                                                         |
| [src/utils/createCookieStorage.ts](src/utils/createCookieStorage.ts)             | `CookieAttributes`, `CookieStorage`, `createCookieStorage`                                                                                                                   |
| [src/utils/createFnWithMiddleware.ts](src/utils/createFnWithMiddleware.ts)       | `AnyFunction`, `NextFunction`, `Context`, `Middleware`, `FnWithMiddleware`, `isFnWithMiddleware`, `CreateFnWithMiddlewareOptions`, `createFnWithMiddleware`                  |
| [src/utils/createObservableStorage.ts](src/utils/createObservableStorage.ts)     | `createObservableStorage`                                                                                                                                                    |
| [src/utils/createRequestFn.ts](src/utils/createRequestFn.ts)                     | `ResponseData`, `WithPromise`, `OriginalRequestFn`, `RequestFnReturnType`, `RequestFn`, `isRequestFn`, `CreateResponseFnParams`, `createRequestFn`                           |
| [src/utils/cryptoRandomUUIDPolyfill.ts](src/utils/cryptoRandomUUIDPolyfill.ts)   | `cryptoRandomUUIDPolyfill`                                                                                                                                                   |
| [src/utils/dateParser.ts](src/utils/dateParser.ts)                               | `dateParser`                                                                                                                                                                 |
| [src/utils/debugLog.ts](src/utils/debugLog.ts)                                   | `debugLog`, `debugDir`, `debugTable`                                                                                                                                         |
| [src/utils/downloadBlob.ts](src/utils/downloadBlob.ts)                           | `downloadBlob`                                                                                                                                                               |
| [src/utils/drawArc.ts](src/utils/drawArc.ts)                                     | `DrawArcOptions`, `drawArc`                                                                                                                                                  |
| [src/utils/emptyWith.ts](src/utils/emptyWith.ts)                                 | `emptyWith`                                                                                                                                                                  |
| [src/utils/fiberToTree.ts](src/utils/fiberToTree.ts)                             | `fiberToTree`                                                                                                                                                                |
| [src/utils/flattenZodError.ts](src/utils/flattenZodError.ts)                     | `FlattenZodErrorParams`, `FlattenZodErrorResultWithPath`, `FlattenZodErrorResult`, `flattenZodError`                                                                         |
| [src/utils/formatTime.ts](src/utils/formatTime.ts)                               | `DEFAULT_TIME_FORMAT`, `setFormatTimeDayjs`, `formatTime`                                                                                                                    |
| [src/utils/getAgeFromId.ts](src/utils/getAgeFromId.ts)                           | `getAgeFromId`                                                                                                                                                               |
| [src/utils/getAll.ts](src/utils/getAll.ts)                                       | `getAll`                                                                                                                                                                     |
| [src/utils/getArray.ts](src/utils/getArray.ts)                                   | `getArray`                                                                                                                                                                   |
| [src/utils/getEnumEntries.ts](src/utils/getEnumEntries.ts)                       | `getEnumEntries`                                                                                                                                                             |
| [src/utils/getEnumKey.ts](src/utils/getEnumKey.ts)                               | `getEnumKey`                                                                                                                                                                 |
| [src/utils/getEnumKeys.ts](src/utils/getEnumKeys.ts)                             | `getEnumKeys`                                                                                                                                                                |
| [src/utils/getEnumOptions.ts](src/utils/getEnumOptions.ts)                       | `EnumOption`, `getEnumOptions`                                                                                                                                               |
| [src/utils/getEnumParser.ts](src/utils/getEnumParser.ts)                         | `getEnumParser`                                                                                                                                                              |
| [src/utils/getEnumValues.ts](src/utils/getEnumValues.ts)                         | `getEnumValues`                                                                                                                                                              |
| [src/utils/getEnumerable.ts](src/utils/getEnumerable.ts)                         | `getEnumerable`                                                                                                                                                              |
| [src/utils/getErrorMessage.ts](src/utils/getErrorMessage.ts)                     | `getErrorMessage`                                                                                                                                                            |
| [src/utils/getFilenameFromHeaders.ts](src/utils/getFilenameFromHeaders.ts)       | `getFilenameFromHeaders`                                                                                                                                                     |
| [src/utils/getHeaders.ts](src/utils/getHeaders.ts)                               | `getHeaders`                                                                                                                                                                 |
| [src/utils/getIdChecksum.ts](src/utils/getIdChecksum.ts)                         | `getIdChecksum`                                                                                                                                                              |
| [src/utils/getIntParser.ts](src/utils/getIntParser.ts)                           | `getIntParser`                                                                                                                                                               |
| [src/utils/getMonthLength.ts](src/utils/getMonthLength.ts)                       | `getMonthLength`                                                                                                                                                             |
| [src/utils/getNaturalParser.ts](src/utils/getNaturalParser.ts)                   | `getNaturalParser`                                                                                                                                                           |
| [src/utils/getNextFiber.ts](src/utils/getNextFiber.ts)                           | `getNextFiber`                                                                                                                                                               |
| [src/utils/getPagination.ts](src/utils/getPagination.ts)                         | `Page`, `PaginationConfig`, `getPagination`                                                                                                                                  |
| [src/utils/getPointToLineMinDistance.ts](src/utils/getPointToLineMinDistance.ts) | `getPointToLineMinDistance`                                                                                                                                                  |
| [src/utils/getPositiveIntParser.ts](src/utils/getPositiveIntParser.ts)           | `getPositiveIntParser`                                                                                                                                                       |
| [src/utils/getProperties.ts](src/utils/getProperties.ts)                         | `getProperties`                                                                                                                                                              |
| [src/utils/getPropertiesIsModified.ts](src/utils/getPropertiesIsModified.ts)     | `getPropertiesIsModified`                                                                                                                                                    |
| [src/utils/getRandomBetween.ts](src/utils/getRandomBetween.ts)                   | `getRandomBetween`                                                                                                                                                           |
| [src/utils/getRandomDate.ts](src/utils/getRandomDate.ts)                         | `getRandomDate`                                                                                                                                                              |
| [src/utils/getRandomId.ts](src/utils/getRandomId.ts)                             | `getRandomId`                                                                                                                                                                |
| [src/utils/getRandomItemFromArray.ts](src/utils/getRandomItemFromArray.ts)       | `getRandomItemFromArray`                                                                                                                                                     |
| [src/utils/getRandomName.ts](src/utils/getRandomName.ts)                         | `getRandomName`                                                                                                                                                              |
| [src/utils/getRandomPhone.ts](src/utils/getRandomPhone.ts)                       | `getRandomPhone`                                                                                                                                                             |
| [src/utils/getRandomPlateNo.ts](src/utils/getRandomPlateNo.ts)                   | `getRandomPlateNo`                                                                                                                                                           |
| [src/utils/getRandomYear.ts](src/utils/getRandomYear.ts)                         | `getRandomYear`                                                                                                                                                              |
| [src/utils/getRemain.ts](src/utils/getRemain.ts)                                 | `getRemain`                                                                                                                                                                  |
| [src/utils/getSample.ts](src/utils/getSample.ts)                                 | `getSample`                                                                                                                                                                  |
| [src/utils/getSexFromId.ts](src/utils/getSexFromId.ts)                           | `getSexFromId`                                                                                                                                                               |
| [src/utils/getUniqueBy.ts](src/utils/getUniqueBy.ts)                             | `getUniqueBy`, `uniqueById`                                                                                                                                                  |
| [src/utils/getWhere.ts](src/utils/getWhere.ts)                                   | `Where`, `getWhere`                                                                                                                                                          |
| [src/utils/ifTwoSegmentsIntersect.ts](src/utils/ifTwoSegmentsIntersect.ts)       | `ifTwoSegmentsIntersect`                                                                                                                                                     |
| [src/utils/intParser.ts](src/utils/intParser.ts)                                 | `intParser`                                                                                                                                                                  |
| [src/utils/isAbortError.ts](src/utils/isAbortError.ts)                           | `isAbortError`                                                                                                                                                               |
| [src/utils/isActiveHref.ts](src/utils/isActiveHref.ts)                           | `ActivePath`, `isActiveHref`                                                                                                                                                 |
| [src/utils/isAsyncGenerator.ts](src/utils/isAsyncGenerator.ts)                   | `isAsyncGenerator`                                                                                                                                                           |
| [src/utils/isFullWidthChar.ts](src/utils/isFullWidthChar.ts)                     | `isFullWidthChar`                                                                                                                                                            |
| [src/utils/isIterable.ts](src/utils/isIterable.ts)                               | `isIterable`                                                                                                                                                                 |
| [src/utils/isLegalId.ts](src/utils/isLegalId.ts)                                 | `isLegalId`                                                                                                                                                                  |
| [src/utils/isNonNullable.ts](src/utils/isNonNullable.ts)                         | `isNonNullable`                                                                                                                                                              |
| [src/utils/isNotEmpty.ts](src/utils/isNotEmpty.ts)                               | `isNotEmpty`                                                                                                                                                                 |
| [src/utils/isNullable.ts](src/utils/isNullable.ts)                               | `isNullable`                                                                                                                                                                 |
| [src/utils/isPlainObject.ts](src/utils/isPlainObject.ts)                         | `isPlainObject`                                                                                                                                                              |
| [src/utils/isZodError.ts](src/utils/isZodError.ts)                               | `isZodError`                                                                                                                                                                 |
| [src/utils/json2type.ts](src/utils/json2type.ts)                                 | `json2type`                                                                                                                                                                  |
| [src/utils/merge.ts](src/utils/merge.ts)                                         | `merge`                                                                                                                                                                      |
| [src/utils/nanoid.ts](src/utils/nanoid.ts)                                       | `nanoid`                                                                                                                                                                     |
| [src/utils/naturalParser.ts](src/utils/naturalParser.ts)                         | `naturalParser`                                                                                                                                                              |
| [src/utils/optionalFn.ts](src/utils/optionalFn.ts)                               | `optionalFn`                                                                                                                                                                 |
| [src/utils/positiveIntParser.ts](src/utils/positiveIntParser.ts)                 | `positiveIntParser`                                                                                                                                                          |
| [src/utils/possibility.ts](src/utils/possibility.ts)                             | `possibility`                                                                                                                                                                |
| [src/utils/prettierError.ts](src/utils/prettierError.ts)                         | `PrettierErrorParams`, `prettierError`                                                                                                                                       |
| [src/utils/readExcel.ts](src/utils/readExcel.ts)                                 | `ReadExcelParams`, `readExcel`                                                                                                                                               |
| [src/utils/readSheet.ts](src/utils/readSheet.ts)                                 | `ParsingOptions`, `Sheet2JSONOpts`, `WorkBookData`, `WorkSheetData`, `WorkSheetCellValue`, `WorkSheetRowData`, `ReadSheetParams`, `readSheet`                                |
| [src/utils/resolveNull.ts](src/utils/resolveNull.ts)                             | `resolveNull`                                                                                                                                                                |
| [src/utils/satisfyKeyword.ts](src/utils/satisfyKeyword.ts)                       | `satisfyKeyword`                                                                                                                                                             |
| [src/utils/setFrameInterval.ts](src/utils/setFrameInterval.ts)                   | `setFrameInterval`                                                                                                                                                           |
| [src/utils/setFrameTimeout.ts](src/utils/setFrameTimeout.ts)                     | `setFrameTimeout`                                                                                                                                                            |
| [src/utils/showTotal.ts](src/utils/showTotal.ts)                                 | `showTotal`                                                                                                                                                                  |
| [src/utils/sleep.ts](src/utils/sleep.ts)                                         | `sleep`                                                                                                                                                                      |
| [src/utils/splitTextToLines.ts](src/utils/splitTextToLines.ts)                   | `SplitTextToLinesOptions`, `splitTextToLines`                                                                                                                                |
| [src/utils/stringToArray.ts](src/utils/stringToArray.ts)                         | `stringToArray`                                                                                                                                                              |
| [src/utils/stringToNumber.ts](src/utils/stringToNumber.ts)                       | `StringToNumberOption`, `stringToNumber`                                                                                                                                     |
| [src/utils/swap.ts](src/utils/swap.ts)                                           | `swap`                                                                                                                                                                       |
| [src/utils/toAdd.ts](src/utils/toAdd.ts)                                         | `toAdd`                                                                                                                                                                      |
| [src/utils/toDelete.ts](src/utils/toDelete.ts)                                   | `toDelete`                                                                                                                                                                   |
| [src/utils/transitionNum.ts](src/utils/transitionNum.ts)                         | `TransitionNumConfig`, `TransitionNum`                                                                                                                                       |
| [src/utils/treeToFibers.ts](src/utils/treeToFibers.ts)                           | `Node`, `Fiber`, `treeToFiber`                                                                                                                                               |
| [src/utils/twoNumberIsEqual.ts](src/utils/twoNumberIsEqual.ts)                   | `twoNumberIsEqual`                                                                                                                                                           |
| [src/utils/uncapitalize.ts](src/utils/uncapitalize.ts)                           | `uncapitalize`                                                                                                                                                               |
| [src/utils/walkThroughFiber.ts](src/utils/walkThroughFiber.ts)                   | `walkThroughFiber`                                                                                                                                                           |
| [src/utils/whileDo.ts](src/utils/whileDo.ts)                                     | `whileDo`                                                                                                                                                                    |
| [src/utils/writeExcel.ts](src/utils/writeExcel.ts)                               | `WriteExcelParams`, `writeExcel`                                                                                                                                             |
| [src/utils/writeSheet.ts](src/utils/writeSheet.ts)                               | `JSON2SheetOpts`, `WriteableWorkSheetCellData`, `WriteableWorkSheetData`, `WriteableWorkBookData`, `WriteSheetParams`, `writeSheet`                                          |
| 上游类型与工具                                                                   | `Re-exports: @1adybug/types`                                                                                                                                                 |
| [src/index.ts](src/index.ts)                                                     | `equal`                                                                                                                                                                      |

导出类型、重载与参数说明见上述源码及随包声明；公开子路径以 package.json 的 exports 为准。

## 行为与集成约束

DOM、Cookie、下载和帧工具依赖浏览器 API。`createRequestFn` 返回 `data`，失败响应会拒绝 Promise，Schema 验证先于实现执行。`readSheet` 接收 ArrayBuffer，`writeSheet` 写入文件或触发浏览器下载。随机示例数据工具不用于安全凭据或真实身份生成。类型工具请使用 `import type`。

## 测试与开发

```sh
pnpm --filter @1adybug/tools... build
pnpm --filter @1adybug/tools test
pnpm --filter @1adybug/tools test:types
```

解析器、枚举映射、对象与集合引用、树遍历、分页边界、中间件顺序、验证失败、存储事件、Cookie、下载、工作表转换、受控随机边界和帧取消。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

MIT.
