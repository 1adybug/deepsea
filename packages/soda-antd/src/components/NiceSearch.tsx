"use client"

import { Select } from "antd"
import { satisfyKeyword } from "deepsea-tools"
import { CSSProperties, ReactNode, useState } from "react"
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

export interface NiceSearchProps<Data, Field extends FieldType<Data> = FieldType<Data>, Value = ValueType<Data, Field>> {
    className?: string
    style?: CSSProperties
    data?: Data[]
    mode?: "multiple" | "tags"
    placeholder?: string
    allowClear?: boolean
    labelField: Key<Data> | ((item: Data) => string)
    valueField: Field
    filter?: (item: FilterItem<Data, Value>, keyword: string) => boolean
    value?: Value | undefined
    onChange?: (value: Value | undefined) => void
}

export function NiceSearch<Data, Field extends FieldType<Data> = FieldType<Data>, Value = ValueType<Data, Field>>({
    className,
    style,
    data,
    labelField,
    valueField,
    filter,
    value: _value,
    onChange: _onChange,
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
        <Select
            className={className}
            style={style}
            showSearch
            filterOption={false}
            defaultActiveFirstOption={false}
            searchValue={keyword}
            onSearch={setKeyword}
            options={options}
            value={value as any}
            onChange={onChange}
            {...rest}
        />
    )
}
