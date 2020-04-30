import { VPRect } from './vprect'
import { IReadonlyVPRect } from './ireadonly-vprect'
import { ReadonlyVPRect } from './readonly-vprect'
import { getVPPoint } from './vppoint'
import { validateRange } from './utils'
import { Matrix } from './matrix'

export type VPScrollerFitMode = "min"|"max"
export class VPScroller {

    private _width: number
    get width(): number {
        return this._width
    }
    set width(value: number) {
        if (this._width == value) return
        this._width = value
        this.invalidate()
    }

    private _height: number
    get height(): number {
        return this._height
    }
    set height(value: number) {
        if (this._height == value) return
        this._height = value
        this.invalidate()
    }

    get contentWidth(): number {
        return this._content.height
    }
    set contentWidth(value: number) {
        if (this._content.height == value) return
        this._content.height = value
        this.invalidate()
    }

    get contentHeight(): number {
        return this._content.height
    }
    set contentHeight(value: number) {
        if (this._content.height == value) return
        this._content.height = value
        this.invalidate()
    }

    private _scrollXEnable: boolean
    get scrollXEnable(): boolean {
        return this._scrollXEnable
    }

    private _scrollX: number
    get scrollX(): number {
        return this._scrollX
    }
    set scrollX(value: number) {
        if (!this._scrollXEnable) return
        value = this.validateScrollValue("x", value)
        if (this._scrollX == value) return
        this._setScrollX(value)
    }

    private _scrollYEnable: boolean
    get scrollYEnable(): boolean {
        return this._scrollYEnable
    }

    private _scrollY: number
    get scrollY(): number {
        return this._scrollY
    }
    set scrollY(value: number) {
        if (!this._scrollYEnable) return
        value = this.validateScrollValue("y", value)
        if (this._scrollY == value) return
        this._setScrollY(value)
    }
    private _content: VPRect
    get content(): IReadonlyVPRect {
        return new ReadonlyVPRect(this._content)
    }
    private _scrollRect: VPRect
    get scrollRect(): IReadonlyVPRect {
        return new ReadonlyVPRect(this._scrollRect)
    }
    private _invalidateFlag: boolean = true
    constructor(
        width: number = 0,
        height: number = 0,
        contentWidth: number = 0,
        contentHeight: number = 0) {

        this._scrollRect = new VPRect()
        this._content = new VPRect(0, 0, contentWidth, contentHeight)
        this.width = width
        this.height = height
        this.validateScrolRect(this._content)
        this.validate()
    }

    validate(): boolean {
        if (!this._invalidateFlag) return false
        this._invalidateFlag = false
        const ct = this._content
        const sr = this._scrollRect

        this._setScrollX(this.validateScrollValue("x", -ct.x, sr))
        this._setScrollY(this.validateScrollValue("y", -ct.y, sr))
        return true
    }

    get currentScale(): number {
        return this.width / this._content.width
    }
    scroll(x: number, y: number) {
        this.scrollX = x
        this.scrollY = y
    }

    scaleAt(x: number, y: number, value) {
        const ct = this._content
        const m = new Matrix()
        m.scaleAt(value, value, x, y)
        ct.setTransform(m)
        this.validateScrolRect(ct)
        const sx = this.validateScrollValue("x", -ct.x)
        const sy = this.validateScrollValue("y", -ct.y)
        this._scrollX = sx
        this._scrollY = sy
        ct.x = -sx
        ct.y = -sy
    }

    fitMax() {
        this.fit('max')
    }

    fitMin() {
        this.fit('min')
    }
    getMinScale(mode: VPScrollerFitMode, width:number, height:number) {
        const w = this._width
        const h = this._height


        const sy = h / width
        let s = w / height
        if (mode == "max") {
            if (sy < s)
                s = sy
        }
        else {
            if (sy > s)
                s = sy
        }
        return s
    }
    private fit(mode: VPScrollerFitMode) {
        const ct = this._content
        const w = this._width
        const h = this._height
        const cw = ct.width
        const ch = ct.height
        const s = this.getMinScale(mode, cw, ch)
        const m = new Matrix()//new DOMMatrix().scaleSelf(s, s, 1, 0, 0, 0)
        m.scale(s, s)
        ct.setTransform(m)
        ct.x = (w - ct.width) / 2
        ct.y = (h - ct.height) / 2
        this.validateScrolRect(ct)
        this._scrollX = this._scrollXEnable ? -ct.x : 0
        this._scrollY = this._scrollYEnable ? -ct.y : 0
    }


    private invalidate() {
        this._invalidateFlag = true
    }

    private validateScrolRect(ct: VPRect) {
        const sr = this._scrollRect
        const vw = this._width
        const vh = this._height
        const cw = ct.width
        const ch = ct.height

        const srW = cw - vw
        const srH = ch - vh

        this._scrollXEnable = srW > 0
        this._scrollYEnable = srH > 0

        let min = getVPPoint(0, 0)
        let max = getVPPoint(0, 0)

        if (srW > 0) {
            min.x = -srW
            max.x = 0
        }
        else {
            min.x = -srW/2
            max.x = min.x
        }

        if (srH > 0) {
            min.y = -srH
            max.y = 0
        }
        else {
            min.y = -srH/2
            max.y = min.y
        }
        sr.topLeft = min
        sr.bottomRight = max
        return sr
    }

    private _setScrollX(value: number) {
        if (!this._scrollXEnable) {
            value = - this._scrollRect.width/2
        }
        this._scrollX = value
        this._content.x = -value
    }

    private _setScrollY(value: number) {
        if (!this._scrollYEnable) {
            value = - this._scrollRect.height/2
        }
        this._scrollY = value
        this._content.y = -value
    }

    private validateScrollValue(axis: "x" | "y", value: number, rect: VPRect = null) {
        if (!rect)
            rect = this._scrollRect
        const k = axis == "x" ? "right" : "bottom"
        const min = rect[axis]
        const max = rect[k]
        return validateRange(value, -max, -min)
    }
}