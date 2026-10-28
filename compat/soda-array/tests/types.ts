import type * as Legacy from "soda-array"
import type * as Current from "@1adybug/array"

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false

type Assert<T extends true> = T

export type CompatibleExports = Assert<Equal<typeof Legacy, typeof Current>>

import "soda-array/types"
const chunks: number[][] = [1, 2, 3].chunk(2)
void chunks

import legacyChunk from "soda-array/pure/actual/array/chunk.js"
import currentChunk from "@1adybug/array/pure/actual/array/chunk.js"
import legacyVirtual from "soda-array/pure/full/virtual/to-exchange"
import currentVirtual from "@1adybug/array/pure/full/virtual/to-exchange"

export type CompatiblePure = Assert<Equal<typeof legacyChunk, typeof currentChunk>>

export type CompatibleVirtual = Assert<Equal<typeof legacyVirtual, typeof currentVirtual>>

const pureChunks: number[][] = legacyChunk([1, 2], 1)
void pureChunks
