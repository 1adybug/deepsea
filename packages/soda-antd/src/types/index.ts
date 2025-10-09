import { Modal } from "antd"
import { ColumnsType } from "antd/es/table"
import { ComponentProps, ReactNode } from "react"

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

export interface EditorProps<Id = string> extends Omit<ComponentProps<typeof Modal>, "title" | "maskClosable" | "onOk" | "onCancel"> {
    id?: Id
    onOpenChange?: (open: boolean) => void
}
