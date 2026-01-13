import { ComponentProps, ReactNode, useCallback, useEffect, useEffectEvent, useMemo } from "react"

import { Select } from "antd"
import { getEnumOptions, isNullable, StrictOmit, ValueOf } from "deepsea-tools"
import { useInputState } from "soda-hooks"

/** enumObject 的类型 */
export type SelectOptions = Record<string, string | number> | ([ReactNode, string | number] | readonly [ReactNode, string | number])[]

/** 获取枚举值的类型 */
export type EnumValue<Options extends SelectOptions> = Options extends any[] ? Options[number][1] : ValueOf<Options>

/** 获取选择器的值的类型 */
export type SelectValue<Options extends SelectOptions, Multiple extends boolean = false, AllowClear extends boolean = false> = Multiple extends true
    ? EnumValue<Options>[]
    : EnumValue<Options> | (AllowClear extends true ? undefined : never)

export interface EnumOption<Options extends SelectOptions> {
    label: ReactNode
    value: EnumValue<Options>
}

export interface EnumSelectProps<Options extends SelectOptions, Multiple extends boolean = false, AllowClear extends boolean = false> extends StrictOmit<
    ComponentProps<typeof Select<SelectValue<Options, Multiple, AllowClear>, EnumOption<Options>>>,
    "children" | "options" | "onChange" | "mode" | "allowClear" | "value"
> {
    enumObject?: Options
    multiple?: Multiple
    allowClear?: AllowClear
    value?: SelectValue<Options, Multiple, AllowClear>
    onChange?: (value: SelectValue<Options, Multiple, AllowClear>, option?: EnumOption<Options> | EnumOption<Options>[] | undefined) => void
    filter?: (option: EnumOption<Options>) => boolean
    /** @deprecated */
    mode?: undefined
    allowUnavailableValue?: boolean
}

export function EnumSelect<Options extends SelectOptions, Multiple extends boolean = false, AllowClear extends boolean = false>({
    value,
    onChange,
    enumObject,
    multiple,
    loading,
    filter,
    allowUnavailableValue,
    mode,
    ...rest
}: EnumSelectProps<Options, Multiple, AllowClear>) {
    const [state, setState] = useInputState(value)

    const onStateChange = useCallback(
        function onStateChange(value: SelectValue<Options, Multiple, AllowClear>, option?: EnumOption<Options> | EnumOption<Options>[] | undefined) {
            setState(value)
            onChange?.(value, option)
        },
        [onChange, setState],
    )

    const onStateChangeLatest = useEffectEvent(onStateChange)

    const options = useMemo(
        () =>
            (
                (Array.isArray(enumObject) ? enumObject.map(([label, value]) => ({ label, value })) : enumObject ? getEnumOptions(enumObject) : undefined) as
                    | EnumOption<Options>[]
                    | undefined
            )?.filter(item => (filter ? filter(item) : true)),
        [enumObject, filter],
    )

    useEffect(() => {
        // 如果正在加载，不进行检查
        if (loading) return

        // 如果允许用户输入任意值，不进行检查
        if (allowUnavailableValue) return

        // 如果没有选项，或者当前值不在选项中，重置值
        if (isNullable(options) || isNullable(state)) return

        // 如果是单选模式，且当前值不在选项中，重置值
        if (!multiple && options.every(item => item.value !== state)) onStateChangeLatest(undefined as SelectValue<Options, Multiple, AllowClear>)

        // 如果是多选模式，且存在值不在选项中，重置值
        if (multiple && (state as EnumValue<Options>[])?.some(item => options.every(option => option.value !== item))) {
            onStateChangeLatest(
                (state as EnumValue<Options>[]).filter(item => options.some(option => option.value === item)) as SelectValue<Options, Multiple, AllowClear>,
            )
        }
    }, [options, allowUnavailableValue, state, multiple, loading])

    return (
        <Select<SelectValue<Options, Multiple, AllowClear>, EnumOption<Options>>
            value={state}
            onChange={onStateChange}
            options={options}
            mode={multiple ? "multiple" : undefined}
            loading={loading}
            {...rest}
        />
    )
}
