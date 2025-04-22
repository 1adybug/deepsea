import { Rule } from "antd/es/form"
import { z } from "zod"

export interface schemaToRuleParams {
    schema: z.Schema
    /** 错误信息分隔符 */
    separator?: string
    /** 错误信息字符串化 */
    stringify?: (errors: z.ZodError<any>) => string
}

function isSchema(schemaOrParams: z.Schema | schemaToRuleParams): schemaOrParams is z.Schema {
    return "safeParse" in schemaOrParams
}

export function schemaToRule(schemaOrParams: z.Schema | schemaToRuleParams): Rule[] {
    const { schema, separator, stringify } = isSchema(schemaOrParams) ? { schema: schemaOrParams } : schemaOrParams
    return [
        {
            validator(rule, value) {
                const { success, error } = schema.safeParse(value)
                if (success) return Promise.resolve()
                if (stringify) return Promise.reject(stringify(error))
                return Promise.reject(
                    error.errors
                        .map(e => e.message)
                        .filter((item, index, array) => array.findIndex(i => i === item) === index)
                        .join(separator ?? "，"),
                )
            },
        },
    ]
}
