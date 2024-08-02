import { TransitionNum, TransitionNumConfig } from "deepsea-tools"
import { useState, useRef, useEffect } from "react"

/** 
 * 用于实现数字的过渡效果
 */
export function useTransitionNum(config: TransitionNumConfig | number) {
    config = typeof config === "number" ? { target: config, speed: 1 } : config
    const { target, speed } = config
    const [num, setNum] = useState(target)
    const t = useRef<TransitionNum | undefined>(undefined)
    if (!t.current) {
        t.current = new TransitionNum(config)
        t.current.subscribe(function (this) {
            if (this.target > this.current) {
                setNum(Math.floor(this.current))
            } else {
                setNum(Math.ceil(this.current))
            }
        })
    }
    t.current.target = target
    t.current.speed = speed
    useEffect(() => {
        return () => t.current?.destroy()
    }, [])
    return num
}
