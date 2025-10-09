import { clsx, getArray, isNullable } from "deepsea-tools"
import { CSSProperties, ComponentProps, Key, ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { DragMoveEvent, DragMoveEvents, useDragMove } from "soda-hooks"

import styles from "./DraggableGrid.module.css"

export type MustBeReactNode<T> = false extends (T extends ReactNode ? true : false) ? false : true

export type MustBeReactKey<T> = false extends (T extends Key ? true : false) ? false : true

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
export type DraggableGridKeyToOrder<K extends Key> = Map<K, number>

/** 次序到元素的 key 的映射 */
export type DraggableGridOrderToKey<K extends Key> = Map<number, K>

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

interface GetOrderMapParams<K extends Key> {
    prev?: DraggableGridKeyToOrder<K>
    orders: number[]
    keys: K[]
    orderPriority: ((a: number, b: number) => number) | undefined
}

function getOrderMap<K extends Key>({ prev, orders, keys, orderPriority }: GetOrderMapParams<K>) {
    const orderSet = new Set(orders)
    const orderMap = new Map<K, number>()

    // 如果 prev 存在，并且继承的 key 中存在溢出的 key
    if (!!prev) {
        const entries = Array.from(prev.entries()).toSorted((a, b) => (orderPriority ? orderPriority(b[1], a[1]) : b[1] - a[1]))
        const newPrev = new Map<K, number>()
        const newOrders = [...orders]
        for (const [key, order] of entries) {
            if (!keys.includes(key)) continue
            const index = newOrders.indexOf(order)
            if (index >= 0) {
                newPrev.set(key, order)
                newOrders.length = index
            } else {
                const newOrder = newOrders.pop()!
                newPrev.set(key, newOrder)
            }
        }
        prev = newPrev
    }

    const newKeys = keys.filter(key => {
        if (!prev) return true
        if (prev.has(key)) {
            const prevOrder = prev.get(key)!
            orderMap.set(key, prevOrder)
            orderSet.delete(prevOrder)
            return false
        }
        return true
    })
    orders = Array.from(orderSet)
    newKeys.forEach((key, index) => orderMap.set(key, orders[index]))
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

function getOrderToKey<K extends Key>(keyToOrder: DraggableGridKeyToOrder<K>) {
    return new Map(Array.from(keyToOrder.entries()).map(([key, order]) => [order, key]))
}

export type DraggableGridPropsCore<T, K extends Key = T extends Key ? T : never> = {
    /** 数据源 */
    items?: T[]
    /** 元素的 key 到次序的映射 */
    orderMap?: DraggableGridKeyToOrder<K>
    /** 次序变化时回调 */
    onOrderMapChange?: (orderMap: DraggableGridKeyToOrder<K>) => void
    /** 禁用的元素 */
    isItemDisabled?: K[] | ((item: T, key: K) => boolean)
    /** 触发移动的元素 */
    handle?: string | HTMLElement | ((item: T, key: K, element: HTMLDivElement) => HTMLElement | undefined | null) | undefined | null
} & (MustBeReactNode<T> extends true
    ? {
          /** 渲染函数，当 T 为 ReactNode 时，render 为可选 */
          render?: (item: T, status: DraggableGridItemStatus) => ReactNode
      }
    : {
          /** 渲染函数，当 T 为 ReactNode 时，render 为可选 */
          render: (item: T, status: DraggableGridItemStatus) => ReactNode
      }) &
    (MustBeReactKey<T> extends true
        ? {
              /** 获取 key 的函数，当 T 为 Key 时，keyExtractor 为可选 */
              keyExtractor?: (item: T) => K
          }
        : {
              /** 获取 key 的函数，当 T 为 Key 时，keyExtractor 为可选 */
              keyExtractor: (item: T) => K
          })

export type DraggableGridProps<T, K extends Key = T extends Key ? T : never> = Omit<ComponentProps<"div">, "className" | "children"> &
    DragMoveEvents<HTMLDivElement> & {
        /** 类名 */
        className?: DraggableGridClassName
        /** 类名 */
        classNames?: DraggableGridClassNames
        /** 样式 */
        style?: DraggableGridStyle

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
        /** 禁用的次序 */
        isOrderDisabled?: number[] | ((order: number) => boolean)
        /** 次序的优先级，可以通过此函数调整元素的优先放置的方向，左上，右上，左下，右下，中心，顺时针，逆时针等等 */
        orderPriority?: (a: number, b: number) => number
    } & DraggableGridPropsCore<T, K>

interface DraggableGridItemProps<T, K extends Key = T extends Key ? T : never> extends ComponentProps<"div">, DragMoveEvents<HTMLDivElement> {
    item: T
    itemKey: K
    /** 触发移动的元素 */
    handle?: string | HTMLElement | ((item: T, key: K, element: HTMLDivElement) => HTMLElement | undefined | null) | undefined | null
}

function DraggableGridItem<T, K extends Key = T extends Key ? T : never>({
    item,
    itemKey,
    handle,
    onDragMoveStart,
    onDragMove,
    onDragMoveEnd,
    ...rest
}: DraggableGridItemProps<T, K>) {
    const element = useRef<HTMLDivElement>(null)

    useDragMove({
        element: isNullable(handle)
            ? element
            : () =>
                  element.current &&
                  (typeof handle === "string"
                      ? (element.current.querySelector(handle) as HTMLElement)
                      : typeof handle === "function"
                        ? handle(item, itemKey, element.current)
                        : handle),
        onDragMoveStart,
        onDragMove,
        onDragMoveEnd,
    })

    return <div ref={element} {...rest} />
}

interface DraggingItem<K extends Key> {
    key: K
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
    keyToOrder: DraggableGridKeyToOrder<K>
}

interface IsLegalOrderMapParams<K extends Key> {
    orders: number[]
    keys: Iterable<K>
    orderMap: DraggableGridKeyToOrder<K>
}

/** 检查 orderMap 是否合法 */
function isLegalOrderMap<K extends Key>({ orders, keys, orderMap }: IsLegalOrderMapParams<K>) {
    if (!isTheSameIterable(orderMap.keys(), keys)) return false
    const values = Array.from(orderMap.values())
    if (values.some(value => !orders.includes(value))) return false
    return values.length === new Set(values).size
}

export function DraggableGrid<T, K extends Key = T extends Key ? T : never>({
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
    isItemDisabled: _isItemDisabled,
    isOrderDisabled,
    orderPriority,
    handle,
    onDragMoveStart: _onDragMoveStart,
    onDragMove: _onDragMove,
    onDragMoveEnd: _onDragMoveEnd,
    ...rest
}: DraggableGridProps<T, K>) {
    const keyToItem = useMemo(() => {
        const keyToItem = new Map<K, T>()
        items.forEach(item => {
            const key = keyExtractor ? keyExtractor(item) : (item as unknown as K)
            keyToItem.set(key, item)
        })
        return keyToItem
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
        if (orderMap && isLegalOrderMap({ orders, keys: keyToItem.keys(), orderMap })) return orderMap
        const newOrderMap = getOrderMap({ prev: orderMap, orders, keys: Array.from(keyToItem.keys()), orderPriority })
        onOrderMapChange?.(newOrderMap)
        return newOrderMap
    })

    /** 拖拽中的元素 */
    const [dragging, setDragging] = useState<DraggingItem<K> | undefined>(undefined)

    const { current: cache } = useRef({
        orders,
        keys: Array.from(keyToItem.keys()),
    })

    useEffect(() => {
        if (!isTheSameArray(dragging?.orders ?? cache.orders, orders) || !isTheSameIterable(dragging?.keyToOrder.keys() ?? cache.keys, keyToItem.keys())) {
            cache.orders = orders
            cache.keys = Array.from((dragging?.keyToOrder ?? keyToItem).keys())
            const newOrderMap = getOrderMap({ prev: dragging?.keyToOrder ?? keyToOrder, orders, keys: cache.keys, orderPriority })
            setKeyToOrder(newOrderMap)
            onOrderMapChange?.(newOrderMap)
            const newRenderKeys = new Set(newOrderMap.keys())
            setRenderKeys(prev => prev.intersection(newRenderKeys).union(newRenderKeys.difference(prev)))
        }
    }, [dragging, cache, orders, keyToItem, keyToOrder, orderPriority, onOrderMapChange])

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
    }, [dragging, orders, columns, rows, gapX, gapY, itemWidth, itemHeight, keyToItem, keyToOrder, onOrderMapChange])

    /** 受控 */
    useEffect(() => {
        if (orderMap === keyToOrder) return
        if (!!orderMap && isLegalOrderMap({ orders, keys: keyToItem.keys(), orderMap })) setKeyToOrder(orderMap)
        else onOrderMapChange?.(keyToOrder)
    }, [orderMap, keyToOrder, onOrderMapChange])

    function onDragMoveStart(key: K, event: DragMoveEvent<HTMLDivElement>) {
        _onDragMoveStart?.(event)
        const position = getPosition({ order: keyToOrder.get(key)!, columns, gapX, gapY, itemWidth, itemHeight })
        recent.current = key
        setDragging({
            key,
            startX: position.x,
            startY: position.y,
            deltaX: event.deltaX,
            deltaY: event.deltaY,
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
        _onDragMove?.(event)
        if (!dragging) return

        const { deltaX, deltaY } = event
        const { key, orders, keyToOrder, startX, startY, columns, gapX, gapY, itemWidth, itemHeight } = dragging!
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

    function onDragMoveEnd(event: DragMoveEvent<HTMLDivElement>) {
        _onDragMoveEnd?.(event)
        if (!dragging) return
        setDragging(undefined)
    }

    function isItemDisabled(key: K) {
        if (!_isItemDisabled) return false
        if (Array.isArray(_isItemDisabled)) return _isItemDisabled.includes(key)
        return _isItemDisabled(keyToItem.get(key)!, key)
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
                if (!keyToItem.has(key)) return undefined
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
                        item={item}
                        itemKey={key}
                        handle={handle}
                        className={clsx(
                            styles.draggableGridItem,
                            typeof classNames?.item === "function" ? classNames.item({ order, isDragging: isDragging }) : classNames?.item,
                        )}
                        style={style}
                        onDragMoveStart={!disabled && !isItemDisabled(key) ? event => onDragMoveStart(key, event) : undefined}
                        onDragMove={!disabled && !isItemDisabled(key) ? onDragMove : undefined}
                        onDragMoveEnd={!disabled && !isItemDisabled(key) ? onDragMoveEnd : undefined}
                        children={children}
                    />
                )
            })}
        </div>
    )
}
