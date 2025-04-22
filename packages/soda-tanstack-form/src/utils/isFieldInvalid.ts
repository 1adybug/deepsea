import { Field } from "./getFieldComponent"

export function isFieldInvalid(field: Field<any>) {
    return field.state.meta.errors.some(Boolean)
}
