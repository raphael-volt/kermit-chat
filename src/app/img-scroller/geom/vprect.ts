import { VPPoint, getVPPoint } from './vppoint'
import { Matrix } from './matrix'

export class VPRect {

    static fromPoint(topLef: VPPoint, bottomRight: VPPoint) {
        const p = new VPRect(topLef.x, topLef.y)
        p.topLeft = topLef
        p.bottomRight = bottomRight
        return p
    }

    private _left: number = 0
    get left(): number {
        return this._left
    }

    // change width, keep right
    set left(value: number) {
        if (this._left == value) return
        this._left = value
        this._x = value
        this._width = this._right - value
    }

    private _right: number = 0
    get right(): number {
        return this._right
    }
    // change width, keep left
    set right(value: number) {
        if (this._right == value) return
        this._right = value
        this._width = value - this._x
    }

    private _top: number = 0
    get top(): number {
        return this._top
    }
    // change height, keep bottom
    set top(value: number) {
        if (this._top == value) return
        this._top = value
        this._y = value
        this._height = this._bottom - value
    }

    private _bottom: number = 0
    get bottom(): number {
        return this._bottom
    }
    // change height, keep top
    set bottom(value: number) {
        if (this._bottom == value) return
        this._bottom = value
        this._height = value - this._y
    }

    private _x: number = 0
    get x(): number {
        return this._x
    }
    // change left and right, keep width
    set x(value: number) {
        if (this._x == value) return
        this._x = value
        this._left = value
        this._right = value + this._width
    }
    private _y: number = 0
    get y(): number {
        return this._y
    }

    // change top and bottom, keep right
    set y(value: number) {
        if (this._y == value) return
        this._y = value
        this._top = value
        this.bottom = value + this._height
    }

    private _width: number = 0
    get width(): number {
        return this._width
    }
    // change right, keep left
    set width(value: number) {
        if (this._width == value) return
        this._width = value
        this._right = this._x + value
    }

    private _height: number = 0
    get height(): number {
        return this._height
    }
    // change bottom, keep top
    set height(value: number) {
        if (this._height == value) return
        this._height = value
        this._bottom = value + this._y
    }

    get topLeft(): VPPoint {
        return getVPPoint(this._x, this._y)
    }
    // change width and height, keep bottom and right
    set topLeft(value: VPPoint) {
        this.x = value.x
        this.y = value.y
    }

    get bottomRight(): VPPoint {
        return getVPPoint(this._right, this._bottom)
    }

    // change width and height, keep top and left
    set bottomRight(value: VPPoint) {
        this.right = value.x
        this.bottom = value.y
    }


    constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
        this.setValues(x, y, w, h)
    }

    setLimits(minX: number, minY: number, maxX: number, maxY: number) {
        this.left = minX
        this.right = maxX
        this.top = minY
        this.bottom = maxY
    }

    setValues(x: number, y: number, w: number, h: number) {
        this.x = x
        this.y = y
        this.width = w
        this.height = h
    }

    containsPoint(value: VPPoint) {
        return this.contains(value.x, value.y)
    }

    contains(x: number, y: number) {
        return (x >= this._x && x <= this._right)
            && (y >= this._y && y <= this._bottom)
    }

    setTransform(m: Matrix) {
        const tl = m.transform([this._x, this._y])
        const br = m.transform([this._right, this._bottom])
        this.setLimits(tl[0], tl[1], br[0], br[1])
    }

    clone() {
        return new VPRect(this._x, this._y, this._width, this._height)
    }
    public toString = (): string => {
        return `left:${this._left.toFixed(2)}, right:${this._right.toFixed(2)},\ntop:${this._top.toFixed(2)}, bottom:${this._bottom.toFixed(2)}\n${this._width.toFixed(2)}x${this._height.toFixed(2)}`
    }
}

