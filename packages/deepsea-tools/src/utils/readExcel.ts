import { read, utils } from "xlsx"

export function readExcel(buffer: ArrayBuffer): Record<string, string | number | boolean | undefined>[] {
    const wb = read(buffer)
    const result = utils.sheet_to_json<any>(wb.Sheets[wb.SheetNames[0]])
    if (typeof result === "object") {
        const data = result.map(item => {
            const record: Record<string, string> = {}
            Object.keys(item)
                .filter(key => key !== "__rowNum__")
                .forEach(key => (record[key] = item[key]))
            return record
        })
        return data
    }
    return []
}
