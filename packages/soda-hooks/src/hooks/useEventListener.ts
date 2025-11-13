import { useEffect, useEffectEvent, useState } from "react"

import { useCalcEffect } from "./useCalcEffect"
import { ElementInput, getElement } from "./useDomEffect"

type GetEventTarget<T extends EventTarget | ElementInput<Element>> = T extends EventTarget ? T : T extends ElementInput<infer U> ? U : never

/**
 * 添加事件监听，会自动清理事件监听
 * 注意：事件监听会在第二次 useEffect 时被添加
 * 注意：请不要在监听函数中使用 this，this 将会被设置为 undefined
 */
export function useEventListener<T extends EventTarget | ElementInput<Element>>(input: T): GetEventTarget<T>["addEventListener"] {
    return function useAddEventListener(type, listener, options) {
        const newListener = useEffectEvent(
            typeof listener === "function"
                ? listener
                : function newListener(event: Event) {
                      listener = listener as EventListenerObject | null
                      listener?.handleEvent?.call(undefined, event)
                  },
        )

        const [target, setTarget] = useState<GetEventTarget<T>>()

        useCalcEffect(
            current => setTarget(current as GetEventTarget<T>),
            [() => (input instanceof EventTarget ? input : (getElement(input) as GetEventTarget<T>))],
        )

        useEffect(() => {
            if (!target) return
            target.addEventListener(type, newListener, options)
            return () => target.removeEventListener(type, newListener, options)
        }, [target])
    }
}
