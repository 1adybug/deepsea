import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { expect, it, vi } from "vitest"

import { getFileData, InputFile } from "../src/components/InputFile"

it("reads Unicode text and preserves the original File in file mode", async () => {
    const file = new File(["格数"], "data.txt", { type: "text/plain" })
    await expect(getFileData(file, "text")).resolves.toBe("格数")
    await expect(getFileData(file, "file")).resolves.toBe(file)
    await expect(getFileData(file, "base64")).resolves.toMatch(/^data:text\/plain;base64,/)
})

it("reports multiple files in order and enables the input after asynchronous reads", async () => {
    const onValueChange = vi.fn()
    const onFileChange = vi.fn()
    render(<InputFile aria-label="files" multiple type="text" onValueChange={onValueChange} onFileChange={onFileChange} />)
    const input = screen.getByLabelText<HTMLInputElement>("files")

    const files = [new File(["first"], "one.txt"), new File(["second"], "two.txt")]

    fireEvent.change(input, { target: { files } })
    expect(input.disabled).toBe(true)
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith(["first", "second"]))
    expect(onFileChange).toHaveBeenCalledWith(files)
    expect(input.disabled).toBe(false)
})
