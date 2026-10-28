import type * as Legacy from "soda-tanstack-form"
import type * as Current from "@1adybug/tanstack-form"

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false

type Assert<T extends true> = T

export type CompatibleExports = Assert<Equal<typeof Legacy, typeof Current>>
