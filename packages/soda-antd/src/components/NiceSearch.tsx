import { ComponentProps, ReactNode, useEffect, useEffectEvent, useMemo } from "react"

import { Select } from "antd"
import { isNullable, satisfyKeyword } from "deepsea-tools"
import { useInputState } from "soda-hooks"

type Key<Data> = keyof Data

type FieldType<Data> = Key<Data> | ((item: Data) => any) | null

type ValueType<Data, Field extends FieldType<Data> = FieldType<Data>> = Field extends null
    ? Data
    : Field extends Key<Data>
      ? Data[Field]
      : Field extends (...args: any[]) => any
        ? ReturnType<Field>
        : never

export interface NiceSearchOption<Value> {
    label: string
    value: Value
}

interface FilterItem<Data, Value> extends NiceSearchOption<Value> {
    data: Data
}

export type NiceSearchSearchConfig<Value> = Omit<
    Exclude<NonNullable<ComponentProps<typeof Select<Value, NiceSearchOption<Value>>>["showSearch"]>, boolean>,
    "filterOption" | "optionFilterProp"
>

export interface NiceSearchProps<
    Data,
    Field extends FieldType<Data> = FieldType<Data>,
    Multiple extends boolean = false,
    Value = ValueType<Data, Field>,
> extends Omit<
    ComponentProps<typeof Select<Value, NiceSearchOption<Value>>>,
    "value" | "onChange" | "options" | "mode" | "searchValue" | "onSearch" | "showSearch"
> {
    data?: Data[]
    multiple?: Multiple
    labelField: Key<Data> | ((item: Data) => string)
    valueField: Field
    filter?: (item: FilterItem<Data, Value>, keyword: string) => boolean
    value?: (Multiple extends true ? Value[] : Value) | undefined
    onChange?: (value: (Multiple extends true ? Value[] : Value) | undefined) => void
    showSearch?: NiceSearchSearchConfig<Value> | boolean
    allowUnavailableValue?: boolean
    mode?: undefined
}

export function NiceSearch<Data, Field extends FieldType<Data> = FieldType<Data>, Multiple extends boolean = false, Value = ValueType<Data, Field>>({
    data,
    labelField,
    valueField,
    filter,
    value: _value,
    onChange: _onChange,
    showSearch,
    defaultActiveFirstOption = false,
    loading,
    allowUnavailableValue,
    multiple,
    mode,
    ...rest
}: NiceSearchProps<Data, Field, Multiple, Value>): ReactNode {
    type State = Multiple extends true ? Value[] : Value

    const [value, setValue] = useInputState(_value as State | undefined)

    const { searchValue, onSearch, ...restShowSearch } = typeof showSearch === "object" ? showSearch : {}

    const [keyword, setKeyword] = useInputState(searchValue ?? "")

    function onKeywordChange(keyword: string) {
        setKeyword(keyword)
        onSearch?.(keyword)
    }

    const options = useMemo(
        () =>
            data
                ?.map(
                    item =>
                        ({
                            data: item,
                            label: typeof labelField === "function" ? labelField(item) : item[labelField],
                            value: valueField === null ? item : typeof valueField === "function" ? valueField(item) : item[valueField as keyof Data],
                        }) as FilterItem<Data, Value>,
                )
                .filter(item => (filter ? filter(item, keyword) : satisfyKeyword(item.label, keyword)))
                .map(({ label, value }) => ({ label, value })),
        [data, filter, keyword, labelField, valueField],
    )

    function onChange(value: State | undefined) {
        _onChange?.(value)
        setValue(value)
    }

    const onChangeLatest = useEffectEvent(onChange)

    useEffect(() => {
        // 如果正在加载，不进行检查
        if (loading) return

        // 如果允许用户输入任意值，不进行检查
        if (allowUnavailableValue) return

        // 如果没有选项，或者当前值不在选项中，重置值
        if (isNullable(options) || isNullable(value)) return

        // 如果是单选模式，且当前值不在选项中，重置值
        if (!multiple && options.every(item => item.value !== value)) onChangeLatest(undefined)

        // 如果是多选模式，且存在值不在选项中，重置值
        if (multiple && (value as Value[]).some(item => options.every(option => option.value !== item)))
            onChangeLatest((value as Value[]).filter(item => options.some(option => option.value === item)) as State)
    }, [multiple, value, options, loading, allowUnavailableValue])

    return (
        <Select<Value, NiceSearchOption<Value>>
            showSearch={
                showSearch === false
                    ? false
                    : {
                          searchValue: keyword,
                          onSearch: onKeywordChange,
                          filterOption: false,
                          ...restShowSearch,
                      }
            }
            defaultActiveFirstOption={defaultActiveFirstOption}
            options={options}
            value={value as Value}
            onChange={onChange as (value: Value) => void}
            mode={multiple ? "multiple" : undefined}
            loading={loading}
            {...rest}
        />
    )
}
