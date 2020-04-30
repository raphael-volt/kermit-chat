import { IReadonlyVPRect } from './ireadonly-vprect'

export class ReadonlyVPRect implements IReadonlyVPRect {

    get x(): number {
        return this.src.x
    }

    get y(): number {
        return this.src.y
    }

    get width(): number {
        return this.src.width
    }

    get height(): number {
        return this.src.height
    }

    get left(): number {
        return this.src.left
    }
    
    get right(): number {
        return this.src.right
    }
    
    get top(): number {
        return this.src.top
    }

    get bottom(): number {
        return this.src.bottom
    }
    
    constructor(private src: IReadonlyVPRect) { }

    toString = (): string => this.src.toString()
}
