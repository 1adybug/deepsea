import { ExportExcelParams, exportExcel } from "deepsea-tools"
import { ComponentPropsWithoutRef, ComponentRef, MouseEvent as ReactMouseEvent, forwardRef } from "react"

export interface ExportExcelProps extends ComponentPropsWithoutRef<"button">, ExportExcelParams {}

/** 导出 excel 的 button 组件 */
const ExportExcel = forwardRef<ComponentRef<"button">, ExportExcelProps>((props, ref) => {
    const { data, fileName, onClick, ...rest } = props

    function onButtonClick(e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) {
        exportExcel({ data, fileName })
        onClick?.(e)
    }

    return <button ref={ref} onClick={onButtonClick} {...rest} />
})

export default ExportExcel
