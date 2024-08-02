/** 
 * 判断是否为异步生成器
 * @param value 任意值
 * @returns 是否为异步生成器
 */
export function isAsyncGenerator(value: AsyncGenerator<void, void, void> | Promise<void>): value is AsyncGenerator<void, void, void> {
    return typeof (value as AsyncGenerator<void, void, void>)[Symbol.asyncIterator] === "function"
}
