# @1adybug/heroui

[English](README.md) | [简体中文](README.zh-CN.md)

面向 TanStack Form 的 HeroUI 表单适配器与选择工具，包含日期时间转换、错误展示和 Toast 工具。

## 能力

- 文本、数字、复选框、选择器、分页和日历控件的字段适配器。
- Date 与时间戳模式、可配置空值和隔离的 FormProvider 配置。

## 安装与运行环境

```sh
pnpm add @1adybug/heroui
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

| Peer 依赖       | 工作区范围 |
| --------------- | ---------- |
| `@heroui/react` | `^2.8.10`  |
| `@types/node`   | `catalog:` |
| `@types/react`  | `^19.3.0`  |
| `react`         | `^19.3.1`  |

## 快速开始

```tsx
import { FormInput, FormProvider } from "@1adybug/heroui"
import type { Field } from "@1adybug/tanstack-form"

function NameField({ field }: { field: Field<string> }) {
    return (
        <FormProvider emptyValue="null">
            <FormInput field={field} label="Name" />
        </FormProvider>
    )
}
```

## 公开 API

| 模块                                                                             | 导出                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/components/AutoRefresh.tsx](src/components/AutoRefresh.tsx)                 | `AutoRefreshProps`, `AutoRefresh`                                                                                                                                                                                                         |
| [src/components/EnumSelect.tsx](src/components/EnumSelect.tsx)                   | `SelectOptions`, `EnumValue`, `SelectValue`, `EnumOption`, `EnumSelectPropsBase`, `EnumSelectProps`, `EnumSelect`, `createEnumSelect`, `EnumSelectComponent`, `FieldEnumSelectProps`, `FieldEnumSelectComponent`, `createFieldEnumSelect` |
| [src/components/ErrorMessage.tsx](src/components/ErrorMessage.tsx)               | `ErrorMessageItem`, `ErrorMessageProps`, `ErrorMessage`                                                                                                                                                                                   |
| [src/components/FormAutocomplete.tsx](src/components/FormAutocomplete.tsx)       | `FormAutocompleteProps`, `FormAutocomplete`                                                                                                                                                                                               |
| [src/components/FormCalendar.tsx](src/components/FormCalendar.tsx)               | `FormCalendarProps`, `FormCalendar`                                                                                                                                                                                                       |
| [src/components/FormCheckbox.tsx](src/components/FormCheckbox.tsx)               | `FormCheckboxProps`, `FormCheckbox`                                                                                                                                                                                                       |
| [src/components/FormCheckboxGroup.tsx](src/components/FormCheckboxGroup.tsx)     | `FormCheckboxGroupProps`, `FormCheckboxGroup`                                                                                                                                                                                             |
| [src/components/FormDateInput.tsx](src/components/FormDateInput.tsx)             | `FormDateInputProps`, `FormDateInput`                                                                                                                                                                                                     |
| [src/components/FormDatePicker.tsx](src/components/FormDatePicker.tsx)           | `FormDatePickerProps`, `FormDatePicker`                                                                                                                                                                                                   |
| [src/components/FormDateRangePicker.tsx](src/components/FormDateRangePicker.tsx) | `FormDateRangePickerProps`, `FormDateRangePicker`                                                                                                                                                                                         |
| [src/components/FormInput.tsx](src/components/FormInput.tsx)                     | `FormInputProps`, `FormInput`                                                                                                                                                                                                             |
| [src/components/FormInputOtp.tsx](src/components/FormInputOtp.tsx)               | `FormInputOtpProps`, `FormInputOtp`                                                                                                                                                                                                       |
| [src/components/FormNumberInput.tsx](src/components/FormNumberInput.tsx)         | `FormNumberInputProps`, `FormNumberInput`                                                                                                                                                                                                 |
| [src/components/FormPagination.tsx](src/components/FormPagination.tsx)           | `FormPaginationProps`, `FormPagination`                                                                                                                                                                                                   |
| [src/components/FormProvider.tsx](src/components/FormProvider.tsx)               | `EmptyValue`, `GetEmptyValue`, `getEmptyValue`, `FormContext`, `FormProviderProps`, `FormProvider`                                                                                                                                        |
| [src/components/FormRadioGroup.tsx](src/components/FormRadioGroup.tsx)           | `FormRadioGroupProps`, `FormRadioGroup`                                                                                                                                                                                                   |
| [src/components/FormRangeCalendar.tsx](src/components/FormRangeCalendar.tsx)     | `FormRangeCalendarProps`, `FormRangeCalendar`                                                                                                                                                                                             |
| [src/components/FormSelect.tsx](src/components/FormSelect.tsx)                   | `SelectionMode`, `SelectLabelPlacement`, `FormSelectProps`, `FormSelect`                                                                                                                                                                  |
| [src/components/FormSwitch.tsx](src/components/FormSwitch.tsx)                   | `FormSwitchProps`, `FormSwitch`                                                                                                                                                                                                           |
| [src/components/FormTextarea.tsx](src/components/FormTextarea.tsx)               | `FormTextareaProps`, `FormTextarea`                                                                                                                                                                                                       |
| [src/components/FormTimeInput.tsx](src/components/FormTimeInput.tsx)             | `FormTimeInputProps`, `FormTimeInput`                                                                                                                                                                                                     |
| [src/types/index.ts](src/types/index.ts)                                         | `Field`                                                                                                                                                                                                                                   |
| [src/utils/addBetterToast.ts](src/utils/addBetterToast.ts)                       | `AddToastParams`, `AddBetterToastParams`, `closeToast`, `addBetterToast`                                                                                                                                                                  |
| [src/utils/getFieldProps.tsx](src/utils/getFieldProps.tsx)                       | `FieldProps`, `FieldPropsWithoutErrorMessage`, `getFieldProps`                                                                                                                                                                            |
| [src/utils/getTimeValue.ts](src/utils/getTimeValue.ts)                           | `DefaultTime`, `getTimeValue`                                                                                                                                                                                                             |
| [src/utils/parseTime.ts](src/utils/parseTime.ts)                                 | `CalendarDate`, `CalendarDateTime`, `fromAbsolute`, `getLocalTimeZone`, `Time`, `ZonedDateTime`, `ParseMode`, `TimeMode`, `DateMode`, `parseTime`                                                                                         |
| [src/utils/range.ts](src/utils/range.ts)                                         | `getRangeValue`, `getFieldRangeValue`, `RangeDefaultTimeBase`, `RangeDefaultTime`, `GetRangeUpdaterParams`, `getRangeUpdater`, `GetOnRangeChangeParams`, `getOnRangeChange`                                                               |
| [src/utils/time.ts](src/utils/time.ts)                                           | `TimeValue`, `TimeValueMode`, `TimeValueModeMap`, `getValue`, `getFieldValue`, `GetUpdaterParams`, `getUpdater`, `GetOnChangeParams`, `getOnChange`                                                                                       |

导出类型、重载与参数说明见上述源码及随包声明；公开子路径以 package.json 的 exports 为准。

## 行为与集成约束

宿主需配置 HeroUI Provider、样式、React 和 TanStack Form。适配器接收含 state.value、验证错误、handleChange 与 handleBlur 的字段。日期转换默认使用本地日期时间字段，纯日期或纯时间值应提供明确默认值。valueMode 控制 Date 或时间戳输出。FormProvider 控制空选择使用 null 还是 undefined。

## 测试与开发

```sh
pnpm --filter @1adybug/heroui... build
pnpm --filter @1adybug/heroui test
pnpm --filter @1adybug/heroui test:types
```

每个字段适配器的空值、取值、变更、失焦与错误契约，枚举工厂及字段绑定、清空选择、嵌套 Provider 隔离、日期及范围引用、Toast 生命周期和更新通知。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

MIT.
