import { CSSProperties, ComponentProps, FC, Key, ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { clsx, equal, getArray } from "deepsea-tools"
import { DragMoveEvent, UseDragMoveParams, useDragMove } from "soda-hooks"

import styles from "./DraggableGrid.module.css"

export type DraggableGridClassName = string | ((status: ContainerStatus) => string)

export type DraggableGridItemClassName = string | ((status: DraggableGridItemStatus) => string)

export type DraggableGridStyle = CSSProperties | ((status: ContainerStatus) => CSSProperties)

export interface DraggableGridClassNames {
    /** 容器 */
    container?: DraggableGridClassName
    /** 元素 */
    item?: DraggableGridItemClassName
}

export interface ContainerStatus {
    /** 是否被拖拽 */
    isDragging: boolean
}

export interface DraggableGridItemStatus {
    /** 当前次序 */
    order: number
    /** 是否被拖拽 */
    isDragging: boolean
}

/** 元素的 key 到次序的映射 */
export type DraggableGridKeyToOrder = Map<Key, number>

/** 次序到元素的 key 的映射 */
export type DraggableGridOrderToKey = Map<number, Key>

function isTheSameArray<T>(a: T[], b: T[]) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false
    }
    return true
}

function isTheSameIterable<T>(a: Iterable<T>, b: Iterable<T>) {
    const aSet = a instanceof Set ? a : new Set(a)
    const bSet = b instanceof Set ? b : new Set(b)
    if (aSet.size !== bSet.size) return false
    return aSet.difference(bSet).size === 0
}

interface GetOrderMapParams<T> {
    prev?: DraggableGridKeyToOrder
    orders: number[]
    keys: Key[]
}

function getOrderMap<T>({ prev, orders, keys }: GetOrderMapParams<T>) {
    const orderSet = new Set(orders)
    const orderMap = new Map<Key, number>()
    const newKeys = keys.filter(key => {
        if (!prev) return true
        if (prev.has(key)) {
            const prevOrder = prev.get(key)!
            orderMap.set(key, prevOrder)
            orderSet.delete(prevOrder)
            return false
        }
    })
    orders = Array.from(orderSet)
    newKeys.forEach((key, index) => orderMap.set(key, orders[index]))
    console.log(Object.fromEntries(orderMap.entries()))
    return orderMap
}

interface GetPositionParams {
    order: number
    columns: number
    gapX: number
    gapY: number
    itemWidth: number
    itemHeight: number
}

interface Position {
    x: number
    y: number
}

function getPosition({ order, columns, gapX, gapY, itemWidth, itemHeight }: GetPositionParams): Position {
    const row = Math.floor(order / columns)
    const column = order % columns
    return {
        x: column * (itemWidth + gapX),
        y: row * (itemHeight + gapY),
    }
}

function getOrderToKey(keyToOrder: DraggableGridKeyToOrder) {
    return new Map(Array.from(keyToOrder.entries()).map(([key, order]) => [order, key]))
}

export type DraggableGridProps<T> = Omit<ComponentProps<"div">, "className" | "children"> & {
    /** 类名 */
    className?: DraggableGridClassName
    /** 类名 */
    classNames?: DraggableGridClassNames
    /** 样式 */
    style?: DraggableGridStyle
    /** 数据源 */
    items?: T[]
    /** 是否禁用拖拽 */
    disabled?: boolean
    /** 列数 */
    columns: number
    /** 行数 */
    rows: number
    /**
     * 间距
     * @default 0
     */
    gap?: number
    /**
     * 水平间距
     * @default 0
     */
    gapX?: number
    /**
     * 垂直间距
     * @default 0
     */
    gapY?: number
    /** 元素宽度 */
    itemWidth: number
    /** 元素高度 */
    itemHeight: number
    /** 元素的 key 到次序的映射 */
    orderMap?: DraggableGridKeyToOrder
    /** 次序变化时回调 */
    onOrderMapChange?: (orderMap: DraggableGridKeyToOrder) => void
    /** 禁用的元素 */
    isItemDisabled?: Key[] | ((item: T) => boolean)
    /** 禁用的次序 */
    isOrderDisabled?: number[] | ((order: number) => boolean)
    /** 次序的优先级，可以通过此函数调整元素的优先放置的方向，左上，右上，左下，右下，中心，顺时针，逆时针等等 */
    orderPriority?: (a: number, b: number) => number
} & (T extends ReactNode
        ? {
              /** 渲染函数，当 T 为 ReactNode 时，render 为可选 */
              render?: (item: T, status: DraggableGridItemStatus) => ReactNode
          }
        : {
              /** 渲染函数，当 T 为 ReactNode 时，render 为可选 */
              render: (item: T, status: DraggableGridItemStatus) => ReactNode
          }) &
    (T extends Key
        ? {
              /** 获取 key 的函数，当 T 为 Key 时，keyExtractor 为可选 */
              keyExtractor?: (item: T) => Key
          }
        : {
              /** 获取 key 的函数，当 T 为 Key 时，keyExtractor 为可选 */
              keyExtractor: (item: T) => Key
          })

interface DraggableGridItemProps extends ComponentProps<"div">, Omit<UseDragMoveParams<HTMLDivElement>, "element"> {}

const DraggableGridItem: FC<DraggableGridItemProps> = ({ onDragMoveStart, onDragMove, onDragMoveEnd, ...rest }) => {
    const element = useRef<HTMLDivElement>(null)

    useDragMove({
        element,
        onDragMoveStart,
        onDragMove,
        onDragMoveEnd,
    })

    return <div ref={element} {...rest} />
}

interface DraggingItem {
    key: Key
    startX: number
    startY: number
    deltaX: number
    deltaY: number
    orders: number[]
    columns: number
    rows: number
    gapX: number
    gapY: number
    itemWidth: number
    itemHeight: number
    keyToOrder: DraggableGridKeyToOrder
}

let cache: any
function log(value: any) {
    if (equal(cache, value)) return
    cache = value
    console.log(value)
}

export function DraggableGrid<T>({
    className,
    classNames,
    style,
    items = [],
    disabled,
    columns,
    rows,
    gap = 0,
    gapX = gap,
    gapY = gap,
    itemWidth,
    itemHeight,
    orderMap,
    onOrderMapChange,
    render,
    keyExtractor,
    isItemDisabled,
    isOrderDisabled,
    orderPriority,
    ...rest
}: DraggableGridProps<T>) {
    const [itemToKey, keyToItem] = useMemo(() => {
        const itemToKey = new Map<T, Key>()
        const keyToItem = new Map<Key, T>()
        items.forEach((item, index) => {
            const key = keyExtractor ? keyExtractor(item) : (item as Key)
            itemToKey.set(item, key)
            keyToItem.set(key, item)
        })
        return [itemToKey, keyToItem] as const
    }, [items, keyExtractor])

    /** 检查 items 中是否有重复的 key */
    if (keyToItem.size !== items.length) throw new Error("there are duplicate keys in the items")

    /** 可用的次序 */
    const orders = useMemo(() => {
        let orders = getArray(columns * rows)
        if (isOrderDisabled) orders = orders.filter(order => (Array.isArray(isOrderDisabled) ? !isOrderDisabled.includes(order) : !isOrderDisabled(order)))
        if (orderPriority) orders = orders.toSorted(orderPriority)
        return orders
    }, [columns, rows, isOrderDisabled, orderPriority])

    /** 检查 items 的数量是否小于可用的次序的数量 */
    // if (items.length < orders.length) throw new Error("the number of items is less than the number of available orders")

    /** 元素的 key 到次序的映射 */
    const [keyToOrder, setKeyToOrder] = useState(() => {
        if (orderMap) return orderMap
        const newOrderMap = getOrderMap({ prev: undefined, orders, keys: Array.from(keyToItem.keys()) })
        onOrderMapChange?.(newOrderMap)
        return newOrderMap
    })

    /** 拖拽中的元素 */
    const [dragging, setDragging] = useState<DraggingItem | undefined>(undefined)

    const { current: cache } = useRef({
        orders,
        keys: Array.from(keyToItem.keys()),
    })

    useEffect(() => {
        if (!isTheSameArray(cache.orders, orders) || !isTheSameIterable(cache.keys, keyToItem.keys())) {
            cache.orders = orders
            cache.keys = Array.from(keyToItem.keys())
            const newOrderMap = getOrderMap({ prev: keyToOrder, orders, keys: cache.keys })
            setKeyToOrder(newOrderMap)
            onOrderMapChange?.(newOrderMap)
            const newRenderKeys = new Set(newOrderMap.keys())
            setRenderKeys(prev => prev.intersection(newRenderKeys).union(newRenderKeys.difference(prev)))
        }
    }, [dragging, orders, keyToItem, keyToOrder, onOrderMapChange])

    /** 渲染的元素的 key，不会随着 keyToOrder 的变化而变化 */
    const [renderKeys, setRenderKeys] = useState(() => new Set(keyToOrder.keys()))

    /** 用于记录最近被拖拽的元素，在元素返回位置时，仍旧能置顶显示 */
    const recent = useRef<Key | undefined>(undefined)

    useEffect(() => {
        if (
            !!dragging &&
            (!isTheSameArray(dragging.orders, orders) ||
                dragging.columns !== columns ||
                dragging.rows !== rows ||
                dragging.gapX !== gapX ||
                dragging.gapY !== gapY ||
                dragging.itemWidth !== itemWidth ||
                dragging.itemHeight !== itemHeight ||
                !isTheSameIterable(dragging.keyToOrder.keys(), keyToItem.keys()))
        ) {
            setDragging(undefined)
            if (isTheSameArray(dragging.orders, orders) && isTheSameIterable(dragging.keyToOrder.keys(), keyToItem.keys())) {
                setKeyToOrder(dragging.keyToOrder)
                onOrderMapChange?.(dragging.keyToOrder)
            }
        }
    }, [orders, keyToItem, keyToOrder, onOrderMapChange])

    /** 受控 */
    useEffect(() => {
        if (orderMap === keyToOrder) return
        if (!!orderMap) setKeyToOrder(orderMap)
        else onOrderMapChange?.(keyToOrder)
    }, [orderMap, keyToOrder, onOrderMapChange])

    function onDragMoveStart(key: Key, event: DragMoveEvent<HTMLDivElement>) {
        const position = getPosition({ order: keyToOrder.get(key)!, columns, gapX, gapY, itemWidth, itemHeight })
        recent.current = key
        setDragging({
            key,
            startX: position.x,
            startY: position.y,
            deltaX: 0,
            deltaY: 0,
            orders,
            columns,
            rows,
            gapX,
            gapY,
            itemWidth,
            itemHeight,
            keyToOrder: keyToOrder,
        })
    }

    function onDragMove(event: DragMoveEvent<HTMLDivElement>) {
        if (!dragging) return

        const { deltaX, deltaY } = event
        const { key, orders, keyToOrder, startX, startY, columns, gapX, gapY, itemWidth, itemHeight } = dragging!
        log(key)
        setDragging(prev => ({ ...prev!, deltaX, deltaY }))
        const x = startX + deltaX
        const y = startY + deltaY
        const currentOrder = keyToOrder.get(key)!
        const currentOrderIndex = orders.indexOf(currentOrder)

        /** 计算元素当前最近的位置 */
        const nearestOrder = orders.toSorted((a, b) => {
            const aPosition = getPosition({ order: a, columns, gapX, gapY, itemWidth, itemHeight })
            const bPosition = getPosition({ order: b, columns, gapX, gapY, itemWidth, itemHeight })
            const aDistance = (x - aPosition.x) ** 2 + (y - aPosition.y) ** 2
            const bDistance = (x - bPosition.x) ** 2 + (y - bPosition.y) ** 2
            if (aDistance - bDistance !== 0) return aDistance - bDistance
            const aIndex = orders.indexOf(a)
            const bIndex = orders.indexOf(b)
            return Math.abs(aIndex - currentOrderIndex) - Math.abs(bIndex - currentOrderIndex)
        })[0]

        /** 如果元素当前最近的位置就是开始移动前的位置，则直接恢复到移动前的次序 */
        if (nearestOrder === currentOrder) {
            setKeyToOrder(keyToOrder)
            onOrderMapChange?.(keyToOrder)
            return
        }

        /** 以元素开始移动前的次序为基准，计算元素当前最近的位置 */
        const newKeyToOrder = new Map(keyToOrder)
        newKeyToOrder.set(key, nearestOrder)

        const orderToKey = getOrderToKey(keyToOrder)

        /** 如果元素当前最近的位置没有被占用，则直接更新次序 */
        if (!orderToKey.has(nearestOrder)) {
            setKeyToOrder(newKeyToOrder)
            onOrderMapChange?.(newKeyToOrder)
            return
        }

        const nearestOrderIndex = orders.indexOf(nearestOrder)

        /**
         * 现在目标位置必定是有元素的
         * 我们需要确定元素在 orders 数组中移动的方向
         * 目标位置的元素方向应该尽量与移动元素移动的方向一致
         */

        const itemDirection = currentOrderIndex > nearestOrderIndex ? "decrease" : "increase"

        const targetDirection =
            (itemDirection === "decrease" && orders.slice(0, nearestOrderIndex).some(order => !orderToKey.has(order))) ||
            (itemDirection === "increase" && orders.slice(nearestOrderIndex + 1).every(order => orderToKey.has(order)))
                ? "decrease"
                : "increase"

        function moveTargetOrder(targetOrder: number) {
            const targetKey = orderToKey.get(targetOrder)!
            const targetOrderIndex = orders.indexOf(targetOrder)
            const nextOrderIndex = targetOrderIndex + (targetDirection === "decrease" ? -1 : 1)
            const nextOrder = orders[nextOrderIndex]
            newKeyToOrder.set(targetKey, nextOrder)
            if (nextOrder === currentOrder || !orderToKey.has(nextOrder)) return
            moveTargetOrder(nextOrder)
        }

        moveTargetOrder(nearestOrder)
        setKeyToOrder(newKeyToOrder)
        onOrderMapChange?.(newKeyToOrder)
    }

    function onDragMoveEnd() {
        if (!dragging) return
        setDragging(undefined)
    }

    return (
        <div
            className={clsx(
                styles.draggableGrid,
                typeof className === "function" ? className({ isDragging: !!dragging }) : className,
                typeof classNames?.container === "function" ? classNames.container({ isDragging: !!dragging }) : classNames?.container,
            )}
            style={
                {
                    "--width": `${columns * (itemWidth + gapX) - gapX}px`,
                    "--height": `${rows * (itemHeight + gapY) - gapY}px`,
                    ...(typeof style === "function" ? style({ isDragging: !!dragging }) : style),
                } as CSSProperties
            }
            {...rest}
        >
            {Array.from(renderKeys).map(key => {
                const item = keyToItem.get(key)!
                const order = keyToOrder.get(key)!
                const isDragging = dragging?.key === key
                const position = getPosition({ order, columns, gapX, gapY, itemWidth, itemHeight })
                const style = (
                    isDragging
                        ? {
                              "--width": `${itemWidth}px`,
                              "--height": `${itemHeight}px`,
                              "--translate-x": `${dragging.startX + dragging.deltaX}px`,
                              "--translate-y": `${dragging.startY + dragging.deltaY}px`,
                              "--transition-property": "none",
                              "--z-index": 999999,
                          }
                        : {
                              "--width": `${itemWidth}px`,
                              "--height": `${itemHeight}px`,
                              "--translate-x": `${position.x}px`,
                              "--translate-y": `${position.y}px`,
                              "--transition-property": "transform",
                              "--z-index": recent.current === key ? 999999 : keyToOrder.get(key),
                          }
                ) as CSSProperties
                const children = render ? render(item, { order, isDragging: isDragging }) : (item as ReactNode)

                return (
                    <DraggableGridItem
                        key={key}
                        className={clsx(
                            styles.draggableGridItem,
                            typeof classNames?.item === "function" ? classNames.item({ order, isDragging: isDragging }) : classNames?.item,
                        )}
                        style={style}
                        onDragMoveStart={!disabled ? event => onDragMoveStart(key, event) : undefined}
                        onDragMove={!disabled ? onDragMove : undefined}
                        onDragMoveEnd={!disabled ? onDragMoveEnd : undefined}
                        children={children}
                    />
                )
            })}
        </div>
    )
}
