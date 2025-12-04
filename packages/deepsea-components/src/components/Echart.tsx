"use client"

import { ComponentProps, FC, ReactNode, Ref, useEffect, useImperativeHandle, useLayoutEffect, useRef } from "react"

import {
    AngleAxisComponentOption,
    AriaComponentOption,
    AxisPointerComponentOption,
    BarSeriesOption,
    BoxplotSeriesOption,
    BrushComponentOption,
    CalendarComponentOption,
    CandlestickSeriesOption,
    ChordSeriesOption,
    ComposeOption,
    ContinousVisualMapComponentOption,
    CustomSeriesOption,
    DatasetComponentOption,
    DataZoomComponentOption,
    ECharts,
    EChartsInitOpts,
    EffectScatterSeriesOption,
    FunnelSeriesOption,
    GaugeSeriesOption,
    GeoComponentOption,
    GraphicComponentOption,
    GraphSeriesOption,
    GridComponentOption,
    HeatmapSeriesOption,
    init,
    InsideDataZoomComponentOption,
    LegendComponentOption,
    LineSeriesOption,
    LinesSeriesOption,
    MapSeriesOption,
    MarkAreaComponentOption,
    MarkLineComponentOption,
    MarkPointComponentOption,
    MatrixComponentOption,
    ParallelSeriesOption,
    PictorialBarSeriesOption,
    PiecewiseVisualMapComponentOption,
    PieSeriesOption,
    PlainLegendComponentOption,
    PolarComponentOption,
    RadarComponentOption,
    RadarSeriesOption,
    RadiusAxisComponentOption,
    SankeySeriesOption,
    ScatterSeriesOption,
    ScrollableLegendComponentOption,
    SeriesOption,
    SingleAxisComponentOption,
    SliderDataZoomComponentOption,
    SunburstSeriesOption,
    ThemeRiverSeriesOption,
    ThumbnailComponentOption,
    TimelineComponentOption,
    TitleComponentOption,
    ToolboxComponentOption,
    TooltipComponentOption,
    TreemapSeriesOption,
    TreeSeriesOption,
    VisualMapComponentOption,
    XAXisComponentOption,
    YAXisComponentOption,
} from "echarts"
import { ECBasicOption } from "echarts/types/src/util/types.js"
import hash from "stable-hash"

export type ChartOption<T extends SeriesOption = never> = ComposeOption<
    | T
    | DatasetComponentOption
    | GridComponentOption
    | LegendComponentOption
    | TitleComponentOption
    | TooltipComponentOption
    | AxisPointerComponentOption
    | GeoComponentOption
    | MarkLineComponentOption
    | MarkPointComponentOption
    | MarkAreaComponentOption
    | DataZoomComponentOption
    | AriaComponentOption
    | BrushComponentOption
    | PolarComponentOption
    | RadarComponentOption
    | XAXisComponentOption
    | YAXisComponentOption
    | MatrixComponentOption
    | GraphicComponentOption
    | ToolboxComponentOption
    | CalendarComponentOption
    | TimelineComponentOption
    | AngleAxisComponentOption
    | RadiusAxisComponentOption
    | SingleAxisComponentOption
    | VisualMapComponentOption
    | ThumbnailComponentOption
    | PlainLegendComponentOption
    | InsideDataZoomComponentOption
    | SliderDataZoomComponentOption
    | PiecewiseVisualMapComponentOption
    | ContinousVisualMapComponentOption
    | ScrollableLegendComponentOption
>

export type BarOption = ChartOption<BarSeriesOption>

export type BoxplotOption = ChartOption<BoxplotSeriesOption>

export type CandlestickOption = ChartOption<CandlestickSeriesOption>

export type ChordOption = ChartOption<ChordSeriesOption>

export type CustomOption = ChartOption<CustomSeriesOption>

export type EffectScatterOption = ChartOption<EffectScatterSeriesOption>

export type FunnelOption = ChartOption<FunnelSeriesOption>

export type GaugeOption = ChartOption<GaugeSeriesOption>

export type GraphOption = ChartOption<GraphSeriesOption>

export type HeatmapOption = ChartOption<HeatmapSeriesOption>

export type LineOption = ChartOption<LineSeriesOption>

export type LinesOption = ChartOption<LinesSeriesOption>

export type MapOption = ChartOption<MapSeriesOption>

export type ParallelOption = ChartOption<ParallelSeriesOption>

export type PictorialBarOption = ChartOption<PictorialBarSeriesOption>

export type PieOption = ChartOption<PieSeriesOption>

export type RadarOption = ChartOption<RadarSeriesOption>

export type SankeyOption = ChartOption<SankeySeriesOption>

export type ScatterOption = ChartOption<ScatterSeriesOption>

export type SunburstOption = ChartOption<SunburstSeriesOption>

export type ThemeRiverOption = ChartOption<ThemeRiverSeriesOption>

export type TreeOption = ChartOption<TreeSeriesOption>

export type TreemapOption = ChartOption<TreemapSeriesOption>

export type ModifiableEChartsInitOpts = Pick<EChartsInitOpts, "width" | "height" | "locale">

export interface EChartInitOption extends Omit<EChartsInitOpts, keyof ModifiableEChartsInitOpts> {}

export interface EchartProps<T extends ECBasicOption = ECBasicOption> extends Omit<ComponentProps<"div">, "children">, ModifiableEChartsInitOpts {
    init?: EChartInitOption
    option: T
    chart?: Ref<ECharts>
}

export type EchartComponent<T extends ECBasicOption = ECBasicOption> = FC<EchartProps<T>>

export function Echart<T extends ECBasicOption = ECBasicOption>({
    ref,
    width,
    height,
    locale,
    init: initOption,
    option,
    chart,
    ...rest
}: EchartProps<T>): ReactNode {
    const container = useRef<HTMLDivElement>(null)
    const chartRef = useRef<ECharts | null>(null)

    useLayoutEffect(() => {
        const ele = container.current!
        chartRef.current = init(ele, option, { ...initOption, width, height, locale })
        return () => chartRef.current?.dispose()
    }, [])

    useImperativeHandle(ref, () => container.current!)

    useImperativeHandle(chart, () => chartRef.current!)

    useEffect(() => chartRef.current?.setOption(option), [hash(option)])

    // @ts-expect-error width and height can be string
    useEffect(() => chartRef.current?.resize({ width, height }), [width, height])

    useEffect(() => chartRef.current?.setOption({ locale }), [locale])

    return <div ref={container} {...rest} />
}

export const Bar = Echart as EchartComponent<BarOption>

export const Boxplot = Echart as EchartComponent<BoxplotOption>

export const Candlestick = Echart as EchartComponent<CandlestickOption>

export const Chord = Echart as EchartComponent<ChordOption>

export const Custom = Echart as EchartComponent<CustomOption>

export const EffectScatter = Echart as EchartComponent<EffectScatterOption>

export const Funnel = Echart as EchartComponent<FunnelOption>

export const Gauge = Echart as EchartComponent<GaugeOption>

export const Graph = Echart as EchartComponent<GraphOption>

export const Heatmap = Echart as EchartComponent<HeatmapOption>

export const Line = Echart as EchartComponent<LineOption>

export const Lines = Echart as EchartComponent<LinesOption>

export const Map = Echart as EchartComponent<MapOption>

export const Parallel = Echart as EchartComponent<ParallelOption>

export const PictorialBar = Echart as EchartComponent<PictorialBarOption>

export const Pie = Echart as EchartComponent<PieOption>

export const Radar = Echart as EchartComponent<RadarOption>

export const Sankey = Echart as EchartComponent<SankeyOption>

export const Scatter = Echart as EchartComponent<ScatterOption>

export const Sunburst = Echart as EchartComponent<SunburstOption>

export const ThemeRiver = Echart as EchartComponent<ThemeRiverOption>

export const Tree = Echart as EchartComponent<TreeOption>

export const Treemap = Echart as EchartComponent<TreemapOption>
