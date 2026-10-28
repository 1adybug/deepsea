import type * as Legacy from "soda-array"
import type * as Current from "@1adybug/array"

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false

type Assert<T extends true> = T

export type CompatibleExports = Assert<Equal<typeof Legacy, typeof Current>>

import "soda-array/types"
const chunks: number[][] = [1, 2, 3].chunk(2)
void chunks
