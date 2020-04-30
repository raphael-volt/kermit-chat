
const MATRIX_REG_EXP = /^matrix\s*\((.*)\)$/i
const NUM_REG_EXP = /[0-9\.\-]+/g
const MATRIX4 = 4
const MATRIX6 = 6

type Number2 = [number, number]
type Number4 = [number, number, number, number]
type Number6 = [number, number, number, number, number, number]
type Matrix4Input = string | Number4 | Number6

const isFixedArray = (value: any, lenght: number) => {
    return Array.isArray(value) && value.length == lenght
}

const isNumber6 = (value: any): value is Number6 => {
    return isFixedArray(value, MATRIX6)
}

const isNumber4 = (value: any): value is Number4 => {
    return isFixedArray(value, MATRIX4)
}

const n6ToN4 = (input: Number6): Number4 => {
    return input.splice(1, 2) as Number4
}

const string6ToN4 = (input: string[]): Number4 | null => {
    if (input.length == MATRIX6) {
        input.splice(1, 2)
        return input.map(s => +s) as Number4
    }
    return null
}

const stringToN4 = (input: string, _default: Number4 = null): Number4 => {
    if (MATRIX_REG_EXP.test(input)) {
        const match = MATRIX_REG_EXP.exec(input)
        const n4 = string6ToN4(match[1].match(NUM_REG_EXP))
        if (n4 !== null)
            return n4
    }
    if (!_default)
        return getIdentity()
    return _default
}

const IDENTITY: Number4 = [1, 1, 0, 0]

const getIdentity = (): Number4 => {
    return IDENTITY.slice() as Number4
}

export { Number2, Number4, Number6, Matrix4Input, isFixedArray }

export class Matrix {

    get number6(): number[] {
        const values = this.number4
        values.splice(1, 0, 0, 0)
        return values
    }

    get number4(): Number4 {
        return this._values.slice() as Number4
    }

    constructor(input?: Matrix4Input) {
        this.set(input)
    }

    identity(): Matrix {
        this._values = getIdentity()
        return this
    }

    set(input: Matrix4Input): void {
        let values: Number4
        if (isNumber4(input))
            values = input
        else
            if (typeof input == "string")
                values = stringToN4(input)
            else
                if (isNumber6(input))
                    values = n6ToN4(input)
                else
                    values = getIdentity()
        this._values = values
    }

    private _values: Number4

    get tx(): number {
        return this._values[2]
    }

    get ty(): number {
        return this._values[3]
    }

    get sx(): number {
        return this._values[0]
    }

    get sy(): number {
        return this._values[1]
    }

    translate(x: number, y: number): Matrix {
        const m = this._values
        m[2] += x
        m[3] += y
        return this
    }

    appendTranslate(x: number, y: number): Matrix {
        const m = this._values
        return this.translate(x * m[0], y * m[1])
    }

    scale(sx: number, sy: number): Matrix {
        const m = this._values
        m[0] *= sx
        m[1] *= sy
        m[2] *= sx
        m[3] *= sy
        return this
    }

    scaleAt(sx: number, sy: number, cx: number, cy: number): Matrix {
        return this.appendTranslate(-cx, -cy)
            .scale(sx, sy)
            .translate(cx, cy)
    }

    invert(): Matrix {
        const m = this._values
        const a: number = m[0]
        const d: number = m[1]
        const tx: number = m[2]
        const ty: number = m[3]
        const n: number = a * d
        if (n != 0) {
            m[0] = d / n
            m[1] = a / n
            m[2] = (- d * tx) / n
            m[3] = -(a * ty) / n
        }
        else {
            const v = 0
            m[0] = v
            m[1] = v
            m[2] = v
            m[3] = v
        }
        return this
    }

    transform(coord: Number2): Number2 {
        coord[0] = this.transformX(coord[0])
        coord[1] = this.transformY(coord[1])
        return coord
    }

    private transformX(x: number): number {
        const m = this._values
        return x * m[0] + m[2]
    }

    private transformY(y: number): number {
        const m = this._values
        return y * m[1] + m[3]
    }

    clone(): Matrix {
        return new Matrix(this.number4)
    }

    toString = (): string => {
        return `matrix(${this.number6.join(', ')})`
    }
}
