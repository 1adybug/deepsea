import { ReactNode } from "react"
import { ColumnsType } from "antd/es/table"

/** 判断两个类型是否全等 */
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

/** 判断是否是 never 类型 */
export type IsNever<T> = [T] extends [never] ? true : false

/** 联合类型转交集 */
export type UnionToIntersection<T> = (T extends any ? (arg: T) => void : never) extends (arg: infer I) => void ? I : never

/** 获取联合类型的最后一个元素 */
export type LastUnion<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R ? R : never

/** 联合类型转元祖 */
export type UnionToTuple<T> = LastUnion<T> extends never ? [] : [...UnionToTuple<Exclude<T, LastUnion<T>>>, LastUnion<T>]

/** 判断一个 key 是否是 required */
export type IsRequired<T, K extends keyof T> = Pick<T, K> extends Required<Pick<T, K>> ? true : false

/** 获取联合类型内部所有 key */
type _KeyofUnion<T, K extends T = T> = K extends T ? keyof K : never

/** 获取联合类型内部所有 key */
export type KeyOfUnion<T> = _KeyofUnion<T>

/** 判断一个 key 在所有的联合类型是否可以是 optional */
type _IsOptionalInUnion<T, K extends KeyOfUnion<T>, P extends T = T> = true extends (
    P extends T ? (K extends keyof P ? (IsRequired<P, K> extends true ? false : true) : true) : never
)
    ? true
    : false

/** 判断一个 key 在所有的联合类型是否可以是 optional */
export type IsOptionalInUnion<T, K extends KeyOfUnion<T>> = _IsOptionalInUnion<T, K>

/** 判断一个 key 在所有的联合类型是否可以是 required */
export type IsRequiredInUnion<T, K extends KeyOfUnion<T>> = IsOptionalInUnion<T, K> extends true ? false : true

/** 获取联合类型内部所有可选的 key */
type _OptionalKeysInUnion<T, K extends KeyOfUnion<T> = KeyOfUnion<T>> = K extends KeyOfUnion<T> ? (IsOptionalInUnion<T, K> extends true ? K : never) : never

/** 获取联合类型内部所有可选的 key */
export type OptionalKeysInUnion<T> = _OptionalKeysInUnion<T>

/** 获取联合类型内部所有必选的 key */
type _RequiredKeysInUnion<T, K extends KeyOfUnion<T> = KeyOfUnion<T>> = K extends KeyOfUnion<T> ? (IsRequiredInUnion<T, K> extends true ? K : never) : never

/** 获取联合类型内部所有必选的 key */
export type RequiredKeysInUnion<T> = _RequiredKeysInUnion<T>

/** 获取联合类型某个 key 所有可能的值 */
type _PossibleValuesInUnion<T, K extends KeyOfUnion<T>, P extends T = T> = P extends T ? (K extends keyof P ? P[K] : never) : never

/** 获取联合类型某个 key 所有可能的值 */
export type PossibleValuesInUnion<T, K extends KeyOfUnion<T>> = _PossibleValuesInUnion<T, K>

/** 判断一个类型是否是普通对象 */
export type IsObject<T> = T extends any[]
    ? false
    : T extends Function
      ? false
      : T extends Record<string, any>
        ? Exclude<keyof T, string | number> extends never
            ? true
            : false
        : false

/** 获取联合类型内部所有的普通对象 */
type _ObjectInUnion<T, K extends T = T> = K extends T ? (IsObject<K> extends true ? K : never) : never

/** 获取联合类型内部所有的普通对象 */
export type ObjectInUnion<T> = _ObjectInUnion<T>

/** 获取联合类型内部所有的数组 */
type _ArrayInUnion<T, K extends T = T> = K extends T ? (K extends (infer X)[] ? X[] : never) : never

/** 获取联合类型内部所有的数组 */
export type ArrayInUnion<T> = _ArrayInUnion<T>

/** 获取联合类型内部所有的非普通对象和数组 */
export type NonObjectOrArrayInUnion<T> = Exclude<T, ObjectInUnion<T> | ArrayInUnion<T>>

/** 将联合类型组合起来 */
export type CombineUnion<T> =
    | NonObjectOrArrayInUnion<T>
    | (ObjectInUnion<T> extends never
          ? never
          : {
                [K in RequiredKeysInUnion<ObjectInUnion<T>>]: CombineUnion<PossibleValuesInUnion<ObjectInUnion<T>, K>>
            } & {
                [K in OptionalKeysInUnion<ObjectInUnion<T>>]?: CombineUnion<PossibleValuesInUnion<ObjectInUnion<T>, K>>
            })
    | (ArrayInUnion<T> extends never ? never : CombineUnion<ArrayInUnion<T>[number]>[])

/** 一般类型 */
export type CommonType = string | number | boolean | null | undefined

/** 判断一个类型能否被 JSON.stringify */
type _CanJSONStringify<T, I extends boolean = false> =
    IsNever<T> extends true
        ? I
        : T extends Function
          ? false
          : Exclude<T, CommonType> extends never
            ? true
            : Exclude<T, CommonType> extends (infer K)[]
              ? _CanJSONStringify<K, true>
              : Exclude<T, CommonType> extends Record<string, any>
                ? Exclude<keyof Exclude<T, CommonType>, string | number> extends never
                    ? _CanJSONStringify<Exclude<T, CommonType>[keyof Exclude<T, CommonType>], true>
                    : false
                : false

/** 判断一个类型能否被 JSON.stringify */
export type CanJSONStringify<T> = _CanJSONStringify<T>

/** 获取字符串提示 */
export type TipString<T extends string> = T | (string & {})

type _Column<T, K extends keyof T = keyof T> = Omit<ColumnsType<T>[0], "dataIndex" | "render"> &
    (
        | (K extends keyof T
              ? {
                    dataIndex: K
                } & (T[K] extends ReactNode
                    ? { render?: (value: T[K], record: T, index: number) => ReactNode }
                    : { render: (value: T[K], record: T, index: number) => ReactNode })
              : never)
        | ({
              dataIndex?: undefined
          } & (T extends ReactNode
              ? { render?: (value: T, record: T, index: number) => ReactNode }
              : { render: (value: T, record: T, index: number) => ReactNode }))
    )

export type Column<T> = _Column<T>

export type Columns<T> = Column<T>[]

/** 编辑器 props */
export interface EditorProps<Data, Error = unknown> {
    id?: "id" extends keyof Data ? Data["id"] : string
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onSuccess?: (data: Data) => void
    onError?: (error: Error) => void
    onSettled?: ((error: Error, data: undefined) => void) | ((error: undefined, data: Data) => void)
}

/** 移除属性 */
export type StrictOmit<T, K extends keyof T> = Omit<T, K>
