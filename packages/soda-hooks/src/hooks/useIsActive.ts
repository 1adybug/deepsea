import { isActiveHref } from "deepsea-tools"

export interface LocationState {
    href: string
}

export type UseLocation = () => LocationState

export function createUseIsActive(useLocation: UseLocation) {
    function useIsActive(href: string) {
        const location = useLocation()
        return isActiveHref(href, location.href)
    }
    return useIsActive
}
