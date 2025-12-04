import { ComponentProps, FC } from "react"

const GOLD = (Math.sqrt(5) - 1) / 2
const GOLD_T = Math.sqrt(1 - GOLD * GOLD)
const HANDLE_LENGTH = (1 - GOLD) * GOLD_T

const FileTypeSize = 512

export const IconFileTypeBase: FC<ComponentProps<"svg">> = props => (
    <svg viewBox={`${-(FileTypeSize / 2)} ${-(FileTypeSize / 2)} ${FileTypeSize} ${FileTypeSize}`} {...props} />
)

export interface IconFileTypePagePropsBase {
    /**
     * 书页颜色，默认为 #f31260
     */
    pageColor?: string
    /**
     * 书页宽度，默认为 512 * 0.75
     */
    pageWidth?: number
    /**
     * 书页贝塞尔曲线尺寸，尺寸越大，圆角越大，默认为 512 * 0.75 * 0.618
     */
    pageBessel?: number
}

export interface IconFileTypePageProps extends IconFileTypePagePropsBase, ComponentProps<"path"> {}

export const IconFileTypePage: FC<IconFileTypePageProps> = ({
    pageColor = "#f31260",
    pageWidth = FileTypeSize * 0.75,
    pageBessel = FileTypeSize * 0.75 * GOLD,
    ...rest
}) => {
    const radius = pageBessel * (1 - GOLD)
    const offset = pageBessel * HANDLE_LENGTH

    return (
        <path
            d={`M ${-(pageWidth / 2 - radius)} ${-(FileTypeSize / 2)}
L ${pageWidth * GOLD - pageWidth / 2} ${-(FileTypeSize / 2)}
L ${pageWidth / 2} ${-(FileTypeSize / 2 - pageWidth * (1 - GOLD))}
L ${pageWidth / 2} ${FileTypeSize / 2 - radius}
C ${pageWidth / 2} ${FileTypeSize / 2 - radius + offset} ${pageWidth / 2 - radius + offset} ${FileTypeSize / 2} ${pageWidth / 2 - radius} ${FileTypeSize / 2}
L ${-(pageWidth / 2 - radius)} ${FileTypeSize / 2}
C ${-(pageWidth / 2 - radius) - offset} ${FileTypeSize / 2} ${-(pageWidth / 2)} ${FileTypeSize / 2 - radius + offset} ${-(pageWidth / 2)} ${FileTypeSize / 2 - radius}
L ${-(pageWidth / 2)} ${-(FileTypeSize / 2 - radius)}
C ${-(pageWidth / 2)} ${-(FileTypeSize / 2 - radius) - offset} ${-(pageWidth / 2 - radius) - offset} ${-(FileTypeSize / 2)} ${-(pageWidth / 2 - radius)} ${-(FileTypeSize / 2)}
Z
`}
            fill={pageColor}
            {...rest}
        />
    )
}

export interface IconFileTypeDogEarPropsBase extends Required<Pick<IconFileTypePagePropsBase, "pageWidth">> {
    /**
     * 折角颜色，默认为 rgba(0, 0, 0, 0.25)
     */
    dogEarColor?: string
    /**
     * 折角大小，默认为 页面宽度 * (1 - 0.618)
     */
    dogEarSize?: number
}

export interface IconFileTypeDogEarProps extends IconFileTypeDogEarPropsBase, ComponentProps<"path"> {}

export const IconFileTypeDogEar: FC<IconFileTypeDogEarProps> = ({
    pageWidth,
    dogEarColor = "rgba(0, 0, 0, 0.25)",
    dogEarSize = pageWidth * (1 - GOLD),
    ...rest
}) => (
    <path
        d={`M ${pageWidth / 2 - dogEarSize} ${-(FileTypeSize / 2)}
L ${pageWidth / 2} ${-(FileTypeSize / 2 - dogEarSize)}
L ${pageWidth / 2 - dogEarSize} ${-(FileTypeSize / 2 - dogEarSize)}`}
        fill={dogEarColor}
        {...rest}
    />
)

export interface IconFileTypeTextPropsBase {
    /**
     * 文字颜色，默认为 白色
     */
    textColor?: string
    /**
     * 文字大小，默认为 512 * 0.25
     */
    textFontSize?: number
    /**
     * 文字字重，默认为 bold
     */
    textFontWeight?: string
    /**
     * 文字字体
     */
    textFontFamily?: string
    /**
     * 文字 x 轴远点，默认为 0
     */
    textX?: number
    /**
     * 文字 y 轴远点，默认为 512 * 0.25
     */
    textY?: number
}

export interface IconFileTypeTextProps extends IconFileTypeTextPropsBase, ComponentProps<"text"> {}

export const IconFileTypeText: FC<IconFileTypeTextProps> = ({
    textColor = "#ffffff",
    textFontSize = FileTypeSize * 0.25,
    textFontWeight = "bold",
    textFontFamily,
    textX = 0,
    textY = FileTypeSize * 0.25,
    ...rest
}) => (
    <text textAnchor="middle" fill={textColor} x={textX} y={textY} fontSize={textFontSize} fontWeight={textFontWeight} fontFamily={textFontFamily} {...rest} />
)

export interface IconFileTypeProps
    extends IconFileTypePagePropsBase, Omit<IconFileTypeDogEarPropsBase, "pageWidth">, IconFileTypeTextPropsBase, ComponentProps<"svg"> {}

export const IconFileType: FC<IconFileTypeProps> = ({
    pageColor,
    pageWidth = FileTypeSize * 0.75,
    pageBessel,
    dogEarColor,
    dogEarSize,
    textColor,
    textFontSize,
    textFontWeight,
    textFontFamily,
    textX,
    textY,
    children,
    ...rest
}) => (
    <IconFileTypeBase {...rest}>
        <IconFileTypePage pageColor={pageColor} pageWidth={pageWidth} pageBessel={pageBessel} />
        <IconFileTypeDogEar pageWidth={pageWidth} dogEarColor={dogEarColor} dogEarSize={dogEarSize} />
        <IconFileTypeText
            textColor={textColor}
            textFontSize={textFontSize}
            textFontWeight={textFontWeight}
            textFontFamily={textFontFamily}
            textX={textX}
            textY={textY}
        >
            {children}
        </IconFileTypeText>
    </IconFileTypeBase>
)
