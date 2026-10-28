import type * as Legacy from "soda-hooks"
import type * as Current from "@1adybug/hooks"

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false

type Assert<T extends true> = T

export type CompatibleExports = Assert<Equal<typeof Legacy, typeof Current>>

export type CompatibleSubpath1 = Assert<Equal<typeof import("soda-hooks/eslint"), typeof import("@1adybug/hooks/eslint")>>
