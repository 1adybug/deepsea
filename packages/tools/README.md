# @1adybug/tools

[English](README.md) | [简体中文](README.zh-CN.md)

General-purpose TypeScript utilities for parsing, collections, request middleware, browser storage, spreadsheets, geometry and animation.

## Features

- Strict query parsers, enum helpers, pagination and immutable collection updates.
- Onion middleware and schema-validated request functions with explicit success/error semantics.
- Observable storage, cookie storage, worksheet import/export and controlled frame scheduling.

## Installation and requirements

```sh
pnpm add @1adybug/tools
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

| Peer dependency | Workspace range |
| --------------- | --------------- |
| `dayjs`         | `^1.11.23`      |
| `zod`           | `^4.6.7`        |

## Quick start

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

## Public API

| Module                                                                           | Exports                                                                                                                                                                      |
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
| Upstream types and helpers                                                       | `Re-exports: @1adybug/types`                                                                                                                                                 |
| [src/index.ts](src/index.ts)                                                     | `equal`                                                                                                                                                                      |

See the linked source and shipped declarations for types, overloads and parameter documentation. package.json exports defines public subpaths.

## Behavior and integration

DOM, cookie, download and frame utilities require browser APIs. `createRequestFn` resolves `data` and rejects failed responses; schema validation precedes the implementation. `readSheet` consumes an ArrayBuffer, while `writeSheet` writes a file or triggers a browser download. Random sample-data helpers are not security primitives or identity issuance tools. Import type helpers with `import type`.

## Tests and development

```sh
pnpm --filter @1adybug/tools... build
pnpm --filter @1adybug/tools test
pnpm --filter @1adybug/tools test:types
```

Parsers, enum mappings, object/collection identity, tree traversal, pagination boundaries, middleware ordering, validation failures, storage events, cookies, downloads, spreadsheet conversion, deterministic random boundaries and frame cancellation.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

MIT.
