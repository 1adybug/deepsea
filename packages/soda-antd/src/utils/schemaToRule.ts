import { Rule } from "antd/es/form"
import { flattenZodError } from "deepsea-tools"
import { $ZodError, $ZodType, safeParse } from "zod/v4/core"

export interface schemaToRuleParams {
    schema: $ZodType
    /** 错误信息分隔符 */
    separator?: string
    /** 错误信息字符串化 */
    stringify?: (errors: $ZodError) => string
}

function isSchema(schemaOrParams: $ZodType | schemaToRuleParams): schemaOrParams is $ZodType {
    return "safeParse" in schemaOrParams
}

export function schemaToRule(schemaOrParams: $ZodType | schemaToRuleParams): Rule[] {
    const { schema, separator, stringify } = isSchema(schemaOrParams) ? { schema: schemaOrParams } : schemaOrParams
    return [
        {
            validator(rule, value) {
                const { success, error } = safeParse(schema, value)
                if (success) return Promise.resolve()
                if (stringify) return Promise.reject(stringify(error))
                return Promise.reject(flattenZodError(error).join(separator ?? "，"))
            },
        },
    ]
}
