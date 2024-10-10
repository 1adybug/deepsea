import { useLatest } from "ahooks"
import ClipboardJS, { Event } from "clipboard"
import { ComponentProps, forwardRef, useEffect, useImperativeHandle, useRef } from "react"

export { Event } from "clipboard"

export type CopyButtonProps = ComponentProps<"button"> & {
    text?: string
    onCopySuccess?: (e: Event) => void
    onCopyError?: (e: Event) => void
}

export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>((props, ref) => {
    const { text, onCopySuccess: _onCoptSuccess, onCopyError: _onCopyError, ...rest } = props
    const ele = useRef<HTMLButtonElement>(null)
    const onCopySuccess = useLatest(_onCoptSuccess)
    const onCopyError = useLatest(_onCopyError)

    useImperativeHandle(ref, () => ele.current!, [ele.current])

    useEffect(() => {
        const clipboard = new ClipboardJS(ele.current!)
        clipboard.on("success", event => onCopySuccess.current?.(event))
        clipboard.on("error", event => onCopyError.current?.(event))
        return () => clipboard.destroy()
    }, [])

    return <button ref={ele} {...rest} data-clipboard-text={text} />
})