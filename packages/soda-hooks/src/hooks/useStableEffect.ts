import { type DependencyList, type EffectCallback, useEffect } from "react"

import stableHash from "stable-hash"

export function useStableEffect(effect: EffectCallback, deps: DependencyList): void {
    const hash = stableHash(deps)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useEffect(effect, [hash])
}
