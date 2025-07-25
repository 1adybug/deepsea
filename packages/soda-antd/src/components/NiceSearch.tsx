"use client"

import { Select } from "antd"
import { DefaultOptionType } from "antd/es/select"
import { satisfyKeyword } from "deepsea-tools"
import { ComponentProps, ReactNode, useState } from "react"
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

type FilterItem<Data, Value> = {
    label: string
    value: Value
    data: Data
}

export interface NiceSearchProps<Data, Field extends FieldType<Data> = FieldType<Data>, Value = ValueType<Data, Field>>
    extends Omit<ComponentProps<typeof Select<Value>>, "value" | "onChange" | "options" | "mode" | "searchValue" | "onSearch"> {
    data?: Data[]
    mode?: "multiple" | "tags"
    labelField: Key<Data> | ((item: Data) => string)
    valueField: Field
    filter?: (item: FilterItem<Data, Value>, keyword: string) => boolean
    value?: Value | undefined
    onChange?: (value: Value | undefined) => void
}

export function NiceSearch<Data, Field extends FieldType<Data> = FieldType<Data>, Value = ValueType<Data, Field>>({
    data,
    labelField,
    valueField,
    filter,
    value: _value,
    onChange: _onChange,
    showSearch = true,
    filterOption = false,
    defaultActiveFirstOption = false,
    ...rest
}: NiceSearchProps<Data, Field, Value>): ReactNode {
    const [value, setValue] = useInputState(_value)
    const [keyword, setKeyword] = useState("")
    const options = data
        ?.map(
            item =>
                ({
                    data: item,
                    label: typeof labelField === "function" ? labelField(item) : item[labelField],
                    value: valueField === null ? item : typeof valueField === "function" ? valueField(item) : item[valueField as keyof Data],
                }) as FilterItem<Data, Value>,
        )
        .filter(item => (filter ? filter(item, keyword) : satisfyKeyword(item.label, keyword)))
        .map(({ label, value }) => ({ label, value }))

    function onChange(value: Value | undefined) {
        _onChange?.(value)
        setValue(value)
    }

    return (
        <Select<Value>
            showSearch={showSearch}
            filterOption={filterOption}
            defaultActiveFirstOption={defaultActiveFirstOption}
            searchValue={keyword}
            onSearch={setKeyword}
            options={options as DefaultOptionType[]}
            value={value}
            onChange={onChange}
            {...rest}
        />
    )
}
