import identifierRegex from "identifier-regex"

/**
 * 将 JSON 转换为 TypeScript 接口
 * @param json - 输入的 JSON 字符串
 * @returns 转换后的 TypeScript 接口字符串
 */
export function json2type(json: string): string {
    const source = JSON.parse(json)

    function combineObjectTypes(types: ObjectType[]): ObjectType {
        if (types.length <= 1) return types[0]
        const keys = Array.from(new Set(types.map(item => Object.keys(interfaces[item.key])).flat()))

        const newType = Object.fromEntries(
            keys.map(key => {
                const valueTypes = new Set<AnyType>()

                types.forEach(item => {
                    const map = interfaces[item.key]

                    if (!Object.hasOwn(map, key)) valueTypes.add("undefined")
                    else valueTypes.add(map[key])
                })

                return [key, combineTypes(Array.from(valueTypes))]
            }),
        )

        types.slice(1).forEach(item => delete interfaces[item.key])
        interfaces[types[0].key] = newType
        return types[0]
    }

    function combineTypes(types: AnyType[]): AnyType {
        types = new UnionType(types).types
        const finalTypes = types.filter(item => typeof item === "string") as AnyType[]
        const objectTypes = types.filter(item => item instanceof ObjectType)
        const arrayTypes = types.filter(item => item instanceof ArrayType)
        const finalObjectType = objectTypes.length === 0 ? undefined : combineObjectTypes(objectTypes)
        const finalArrayType = arrayTypes.length === 0 ? undefined : new ArrayType(combineTypes(arrayTypes.map(item => item.itemType)))
        if (finalObjectType) finalTypes.push(finalObjectType)
        if (finalArrayType) finalTypes.push(finalArrayType)
        if (finalTypes.length === 1) return finalTypes[0]
        return new UnionType(finalTypes)
    }

    let interfaces: Record<string, Record<string, AnyType>> = {}

    type BaseType = "string" | "number" | "boolean" | "null" | "undefined"

    const baseTypes: BaseType[] = ["string", "number", "boolean", "null", "undefined"]

    type AnyType = BaseType | ObjectType | ArrayType | UnionType

    const objectTypes: Record<string, ObjectType> = {}

    class ObjectType {
        constructor(public key: string) {
            objectTypes[key] = this
        }

        toString() {
            return this.key
        }
    }

    class ArrayType {
        constructor(public itemType: AnyType) {}

        toString(): string {
            return `Array<${this.itemType.toString() || "unknown"}>`
        }
    }

    class UnionType {
        types: Exclude<AnyType, UnionType>[]

        constructor(types: AnyType[]) {
            const types2: Exclude<AnyType, UnionType>[] = []

            function addType(type: UnionType) {
                type.types.forEach(item => {
                    if (item instanceof UnionType) addType(item)
                    else types2.push(item)
                })
            }

            types.forEach(item => {
                if (item instanceof UnionType) addType(item)
                else types2.push(item)
            })

            this.types = Array.from(new Set(types2)).toSorted((a, b) => getTypeWeight(a) - getTypeWeight(b))
        }

        toString(): string {
            return this.types
                .map(item => {
                    if (typeof item === "string") return item
                    return item.toString()
                })
                .join(" | ")
        }
    }

    function getTypeWeight(type: AnyType) {
        if (typeof type === "string") return baseTypes.indexOf(type)
        if (type instanceof ObjectType) return -1
        return -2
    }

    function _json2type(source: any, property = "root"): BaseType | ObjectType | ArrayType {
        if (source === null) return "null"
        const type = typeof source
        if (type !== "object") return type as BaseType

        if (!Array.isArray(source)) {
            const type2 = Object.fromEntries(Object.entries(source).map(([key, value]) => [key, _json2type(value, key)]))
            let key = property.replace(/^./, s => s.toUpperCase()) || "BlankKey"

            const nums = Object.keys(interfaces)
                .filter(item => item.startsWith(key) && /^\d*$/.test(item.slice(key.length)))
                .map(item => Number(item.slice(key.length) || "1"))

            if (nums.length > 0) key = `${key}${Math.max(...nums) + 1}`
            interfaces[key] = type2
            return new ObjectType(key)
        }

        return new ArrayType(combineTypes(source.map(item => _json2type(item, `${property}Item`))))
    }

    function isSameType(a: AnyType, b: AnyType): boolean {
        if (a.constructor !== b.constructor) return false
        if (typeof a === "string" && typeof b === "string") return a === b

        if (a instanceof ObjectType && b instanceof ObjectType) {
            if (a.key === b.key) return true
            const aMap = interfaces[a.key]
            const bMap = interfaces[b.key]
            if (Object.keys(aMap).length !== Object.keys(bMap).length) return false
            return Object.entries(aMap).every(([key, value]) => Object.hasOwn(bMap, key) && isSameType(value, bMap[key]))
        }

        if (a instanceof ArrayType && b instanceof ArrayType) return isSameType(a.itemType, b.itemType)

        if (a instanceof UnionType && b instanceof UnionType) {
            if (a.types.length !== b.types.length) return false

            const bTypes = [...b.types]

            for (const type of a.types) {
                const index = bTypes.findIndex(item => isSameType(type, item))
                if (index === -1) return false
                bTypes.splice(index, 1)
            }

            return bTypes.length === 0
        }

        throw new Error("unreachable point")
    }

    const type = _json2type(source)

    if (typeof type === "string") return type

    while (true) {
        let changed = false

        const entries = Object.entries(interfaces).reduce((acc: [string, Record<string, AnyType>][], [key, value]) => {
            const entry = acc.find(([key2]) => isSameType(objectTypes[key], objectTypes[key2]))

            if (entry) {
                changed = true
                objectTypes[key].key = entry[0]
            } else acc.push([key, value])

            return acc
        }, [])

        if (!changed) break
        interfaces = Object.fromEntries(entries)
    }

    const reg = identifierRegex()

    return Object.entries(interfaces)
        .map(
            ([key, value]) => `export interface ${key} {
    ${Object.entries(value)
        .map(
            ([key2, value2]) =>
                `${reg.test(key2) ? key2 : `"${key2}"`}${value2 instanceof UnionType && value2.types.includes("undefined") ? "?" : ""}: ${value2.toString()}`,
        )
        .join(`\n    `)}
}
`,
        )
        .join(`\n`)
}
