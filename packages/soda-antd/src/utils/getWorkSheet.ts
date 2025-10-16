import { ReactNode } from "react"
import { WriteableWorkSheetCellData } from "deepsea-tools"
import { renderToText, renderToWorkSheetCell } from "soda-react"

import { Columns } from "@/types"

export interface GetWorkSheetParams<T> {
    data: T[]
    columns: Columns<T>
}

export function getWorkSheet<T>({ data, columns }: GetWorkSheetParams<T>) {
    return data.map((item, index) =>
        columns.reduce((acc: Record<string, WriteableWorkSheetCellData>, item2) => {
            const key = renderToText(item2.title as ReactNode)
            const value = renderToWorkSheetCell(
                item2.render
                    ? item2.render((typeof item2.dataIndex === "string" ? item[item2.dataIndex] : item) as never, item, index)
                    : item[item2.dataIndex as keyof T],
            )
            acc[key] = value as WriteableWorkSheetCellData
            return acc
        }, {}),
    )
}
