import { Rule } from "antd/es/form"
import { flattenZodError } from "deepsea-tools"
import { $ZodError, $ZodType, safeParse } from "zod/v4/core"

export interface schemaToRuleParams<T> {
    schema: $ZodType<T>
    /** 错误信息分隔符，默认为 " / " */
    separator?: string
    /** 错误信息字符串化 */
    stringify?: (errors: $ZodError<T>) => string
}

function isSchema<T>(schemaOrParams: $ZodType<T> | schemaToRuleParams<T>): schemaOrParams is $ZodType<T> {
    return "safeParse" in schemaOrParams
}

export function schemaToRule<T>(schemaOrParams: $ZodType<T> | schemaToRuleParams<T>): Rule {
    const { schema, separator, stringify } = isSchema(schemaOrParams) ? { schema: schemaOrParams } : schemaOrParams
    return {
        validator(rule, value) {
            const { success, error } = safeParse(schema, value)
            if (success) return Promise.resolve()
            if (stringify) return Promise.reject(stringify(error))
            return Promise.reject(flattenZodError(error).join(separator ?? " / "))
        },
    }
}
