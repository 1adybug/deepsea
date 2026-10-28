import type * as Legacy from "soda-type"
import type * as Current from "@1adybug/types"

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false

type Assert<T extends true> = T

export type CompatibleExports = Assert<Equal<typeof Legacy, typeof Current>>

import type { Equal as LegacyEqual } from "soda-type"
import type { Equal as CurrentEqual } from "@1adybug/types"

export type CompatibleTypes = Assert<Equal<LegacyEqual<string, number>, CurrentEqual<string, number>>>
