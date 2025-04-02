import { Field } from "soda-tanstack-form"

export function isFieldInvalid(field: Field<any>) {
    return field.state.meta.errors.some(Boolean)
}
