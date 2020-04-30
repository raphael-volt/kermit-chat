
export type VPPoint = {
    x: number
    y: number
}

const getVPPoint = (x: number, y: number): VPPoint => {
    return { x: x, y: y }
}

const isVPPoint = (value: any): value is VPPoint => {
    return (typeof value == "object" && ("x" in value && "y" in value))
}

export { isVPPoint, getVPPoint }