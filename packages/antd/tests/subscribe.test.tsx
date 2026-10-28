import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { Form } from "antd"
import { expect, it, vi } from "vitest"

import { FormSubscribe } from "../src/components/FormSubscribe"

it("subscribes to selected form values and updates children after edits", async () => {
    vi.stubGlobal(
        "matchMedia",
        vi.fn(() => ({ matches: false, addListener() {}, removeListener() {} })),
    )

    try {
        render(
            <Form initialValues={{ name: "initial" }}>
                <Form.Item name="name">
                    <input aria-label="name" />
                </Form.Item>
                <FormSubscribe selector={(values: { name: string }) => values.name}>{name => <output data-testid="selection">{name}</output>}</FormSubscribe>
            </Form>,
        )

        await waitFor(() => expect(screen.getByTestId("selection").textContent).toBe("initial"))
        fireEvent.change(screen.getByLabelText("name"), { target: { value: "changed" } })
        await waitFor(() => expect(screen.getByTestId("selection").textContent).toBe("changed"))
    } finally {
        vi.unstubAllGlobals()
    }
})
