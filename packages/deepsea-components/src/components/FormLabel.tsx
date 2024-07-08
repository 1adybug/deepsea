import { css } from "@emotion/css"
import { clsx } from "deepsea-tools"
import { ComponentProps, FC, Fragment } from "react"

export type FormLabelProps = ComponentProps<"div"> & {
    /**
     * Label 的宽度.
     */
    width: number
    /**
     * 是否在 Label 前面添加一个空白区域，只有当前 Label 为非必选，而存在其他 Label 为必选的时候开启
     */
    before?: boolean
}

/**
 * 为 Ant Design 的 FormItem 设计的 Label 组件
 */
const FormLabel: FC<FormLabelProps> = props => {
    const { className, style, before, width, ...rest } = props

    return (
        <Fragment>
            {!!before && <div className="w-[11px]">&ensp;</div>}
            <div
                className={clsx(
                    css`
                        text-align: justify;
                        text-align-last: justify;
                    `,
                    className
                )}
                style={{ width, ...style }}
                {...rest}
            />
        </Fragment>
    )
}

export default FormLabel
