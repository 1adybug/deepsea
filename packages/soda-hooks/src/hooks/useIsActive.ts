import { ActivePath, isActiveHref } from "deepsea-tools"

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
