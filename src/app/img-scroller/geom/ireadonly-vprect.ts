export interface IReadonlyVPRect {
    readonly x: number
    readonly y: number
    readonly width: number
    readonly height: number
    readonly left: number
    readonly right: number
    readonly top: number
    readonly bottom: number
    toString: () => string
}