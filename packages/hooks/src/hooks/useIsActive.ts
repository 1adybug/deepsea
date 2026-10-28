import { type ActivePath, isActiveHref } from "@1adybug/tools"

export interface LocationState {
    href: string
}

export type UseLocation = () => LocationState | ActivePath

export function createUseIsActive(useLocation: UseLocation) {
    function useIsActive(href: string | ActivePath) {
        const location = useLocation()
        return isActiveHref(href, "href" in location ? location.href : location)
    }

    return useIsActive
}
