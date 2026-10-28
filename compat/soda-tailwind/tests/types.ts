import type * as Legacy from "soda-tailwind"
import type * as Current from "@1adybug/tailwind"

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false

type Assert<T extends true> = T

export type CompatibleExports = Assert<Equal<typeof Legacy, typeof Current>>
