# @1adybug/heroui

[English](README.md) | [简体中文](README.zh-CN.md)

HeroUI form adapters and selection utilities for TanStack Form, with date/time conversion, validation messages and toast helpers.

## Features

- Field adapters for text, number, checkbox, selection, pagination and calendar controls.
- Date/timestamp modes, configurable empty values and isolated FormProvider configuration.

## Installation and requirements

```sh
pnpm add @1adybug/heroui
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

| Peer dependency | Workspace range |
| --------------- | --------------- |
| `@heroui/react` | `^2.8.10`       |
| `@types/node`   | `catalog:`      |
| `@types/react`  | `^19.3.0`       |
| `react`         | `^19.3.1`       |

## Quick start

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

## Public API

| Module                                                                           | Exports                                                                                                                                                                                                                                   |
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

See the linked source and shipped declarations for types, overloads and parameter documentation. package.json exports defines public subpaths.

## Behavior and integration

The host supplies HeroUI providers/styles, React and TanStack Form. Adapters consume a field with state.value, validation errors, handleChange and handleBlur. Date conversions default to local calendar/time fields; provide explicit defaults for date-only/time-only values. valueMode selects Date or timestamp output. FormProvider controls null versus undefined for empty selections.

## Tests and development

```sh
pnpm --filter @1adybug/heroui... build
pnpm --filter @1adybug/heroui test
pnpm --filter @1adybug/heroui test:types
```

Every field adapter's empty/value/change/blur/error contract, enum factories and field bindings, selection clearing, nested provider isolation, date/range identity, toast lifecycle and update notifications.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

MIT.
