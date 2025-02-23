"use client"

import {
    ComponentPropsWithoutRef,
    ForwardRefExoticComponent,
    ForwardedRef,
    RefAttributes,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
} from "react"
import {
    BarSeriesOption,
    ComposeOption,
    DatasetComponentOption,
    ECharts,
    GridComponentOption,
    LineSeriesOption,
    PieSeriesOption,
    TitleComponentOption,
    TooltipComponentOption,
    init,
} from "echarts"

export type PieOption = ComposeOption<PieSeriesOption | TitleComponentOption | DatasetComponentOption | GridComponentOption | TooltipComponentOption>

export type BarOption = ComposeOption<BarSeriesOption | TitleComponentOption | DatasetComponentOption | GridComponentOption | TooltipComponentOption>

export type LineOption = ComposeOption<LineSeriesOption | TitleComponentOption | DatasetComponentOption | GridComponentOption | TooltipComponentOption>

export interface EchartProps<T extends any = any> extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
    width: number
    height: number
    option: T
    chart?: ForwardedRef<ECharts>
}

export type EchartComponent<T extends PieOption | BarOption | LineOption> = ForwardRefExoticComponent<
    Omit<EchartProps<T>, "ref"> & RefAttributes<HTMLDivElement>
>

const Echart = forwardRef<HTMLDivElement, EchartProps>((props, ref) => {
    const { width, height, option, chart, ...rest } = props
    const container = useRef<HTMLDivElement>(null)
    const chartRef = useRef<ECharts | null>(null)

    useLayoutEffect(() => {
        const ele = container.current!
        chartRef.current = init(ele, option, { width, height })
        return () => chartRef.current?.dispose()
    }, [])

    useImperativeHandle(ref, () => container.current!, [])

    useImperativeHandle(chart, () => chartRef.current!, [])

    useEffect(() => {
        chartRef.current?.setOption(option)
        chartRef.current?.resize({ width, height })
    })

    return <div ref={container} {...rest} />
})

export const Pie = Echart as EchartComponent<PieOption>
export const Bar = Echart as EchartComponent<BarOption>
export const Line = Echart as EchartComponent<LineOption>
