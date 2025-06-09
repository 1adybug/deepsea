import { resolveNull } from "./resolveNull"

/** 
 * 当条件为真时，返回 action 函数，否则返回 resolveNull 函数
 */
export function whileDo<T>(condition: boolean | (() => boolean), action: () => Promise<T>): () => Promise<T | null> {
    condition = typeof condition === "function" ? condition() : condition
    return condition ? action : resolveNull
}
