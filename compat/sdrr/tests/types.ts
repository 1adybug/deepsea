import type * as Legacy from "sdrr"
import type * as Current from "@1adybug/react-router-cli"

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false

type Assert<T extends true> = T

export type CompatibleExports = Assert<Equal<typeof Legacy, typeof Current>>

export type CompatibleSubpath1 = Assert<Equal<typeof import("sdrr/vite"), typeof import("@1adybug/react-router-cli/vite")>>

export type CompatibleSubpath2 = Assert<Equal<typeof import("sdrr/rsbuild"), typeof import("@1adybug/react-router-cli/rsbuild")>>
