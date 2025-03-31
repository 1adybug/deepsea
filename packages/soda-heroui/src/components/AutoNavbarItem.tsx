import { ComponentProps, ReactNode } from "react"
import { NavbarItem } from "@heroui/react"
import { isActiveHref } from "deepsea-tools"
import { StrictOmit } from "soda-type"

export interface AutoNavbarItemProps extends StrictOmit<ComponentProps<typeof NavbarItem>, "isActive"> {
    href: string
}

export interface LocationState {
    href: string
}

export interface CreateAutoNavbarItemParams {
    useLocation: () => LocationState
}

export function createAutoNavbarItem({ useLocation }: CreateAutoNavbarItemParams) {
    function AutoNavbarItem(props: AutoNavbarItemProps): ReactNode {
        const { href, ...rest } = props
        const location = useLocation()
        return <NavbarItem {...rest} isActive={isActiveHref(href, location.href)} />
    }

    return AutoNavbarItem
}
