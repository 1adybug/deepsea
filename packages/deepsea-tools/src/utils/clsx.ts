import { ClassValue, clsx as _clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 让 clsx 支持 tailwindcss 的合并
 * @param inputs 类名
 * @returns 合并后的类名
 */
export function clsx(...inputs: ClassValue[]) {
    return twMerge(_clsx(...inputs))
}
