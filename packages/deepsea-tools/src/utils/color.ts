const colorReg = /^#?([0-9a-fA-F]{3})$/

const colorReg2 = /^#?([0-9a-fA-F]{6})$/

const colorReg3 = /^#?([0-9a-fA-F]{8})$/

const colorReg4 = /^rgb\( *(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]) *, *(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]) *, *(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]) *\)$/

const colorReg5 =
    /^rgba\( *(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]) *, *(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]) *, *(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5]) *, *(0|0?\.\d+|1(\.0+)?) *\)$/

export interface Color {
    toString(this: Color, type?: ColorType): string
}

export class Color {
    r: number
    g: number
    b: number
    a: number
    constructor(color: string) {
        const match = color.match(colorReg)
        if (match) {
            this.r = parseInt(match[1][0] + match[1][0], 16)
            this.g = parseInt(match[1][1] + match[1][1], 16)
            this.b = parseInt(match[1][2] + match[1][2], 16)
            this.a = 1
            return
        }
        const match2 = color.match(colorReg2)
        if (match2) {
            this.r = parseInt(match2[1].slice(0, 2), 16)
            this.g = parseInt(match2[1].slice(2, 4), 16)
            this.b = parseInt(match2[1].slice(4), 16)
            this.a = 1
            return
        }
        const match3 = color.match(colorReg3)
        if (match3) {
            this.r = parseInt(match3[1].slice(0, 2), 16)
            this.g = parseInt(match3[1].slice(2, 4), 16)
            this.b = parseInt(match3[1].slice(4, 6), 16)
            this.a = parseInt(match3[1].slice(6), 16) / 255
            return
        }
        const match4 = color.match(colorReg4)
        if (match4) {
            this.r = parseInt(match4[1])
            this.g = parseInt(match4[2])
            this.b = parseInt(match4[3])
            this.a = 1
            return
        }
        const match5 = color.match(colorReg5)
        if (match5) {
            this.r = parseInt(match5[1])
            this.g = parseInt(match5[2])
            this.b = parseInt(match5[3])
            this.a = parseFloat(match5[4])
            return
        }
        throw new TypeError("unavailable color")
    }
}

export type ColorType = "HEX" | "HEXA" | "RGB" | "RGBA"

function padHex(value: number): string {
    return value.toString(16).padStart(2, '0');
}

Color.prototype.toString = function toString(this: Color, type?: ColorType): string {
    type = type?.toUpperCase() as ColorType | undefined

    if (type === "HEX") return `#${padHex(this.r)}${padHex(this.g)}${padHex(this.b)}`

    if (type === "HEXA") return `#${padHex(this.r)}${padHex(this.g)}${padHex(this.b)}${padHex(Math.round(this.a * 255))}`

    if (type === "RGB") return `rgb(${this.r}, ${this.g}, ${this.b})`

    if (type === "RGBA") return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`

    return this.a === 1 ? `rgb(${this.r}, ${this.g}, ${this.b})` : `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
}
