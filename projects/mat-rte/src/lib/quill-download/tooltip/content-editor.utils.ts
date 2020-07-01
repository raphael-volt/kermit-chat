const WHITE_SPACE_COLLAPSE = /\s+/gm
const WHITE_SPACE_REPLACE: string = " "
const returnCodes = [13, 14]

export const isReturnCode = (keyCode: number) => returnCodes.indexOf(keyCode) > -1

export const getRange = () => {
    const sel = window.getSelection()
    return [sel.anchorOffset, sel.focusOffset].sort((a, b) => a - b)
}
export const getCarretPosition = () => {
    return getRange()[0]

}
export const moveCaret = (node: HTMLElement, index: number = -1) => {
    const textNode = node.firstChild
    const length = node.innerText.length
    node.focus()
    if (!length)
        return
    if (index > length)
        index = length
    const caret = index == -1 ? length : index
    const range = document.createRange()
    range.setStart(textNode, caret)
    range.setEnd(textNode, caret)
    removeRange().addRange(range)
}
export const removeRange = ()=>{
    const sel = window.getSelection()
    sel.removeAllRanges()
    return sel
}
export const whiteSpaceCollapse = (text: string): string => {
    return text.replace(WHITE_SPACE_COLLAPSE, WHITE_SPACE_REPLACE)
}

export const paste = (element: HTMLElement, text: string, replaceLineBreak: boolean = false) => {
    if (replaceLineBreak)
        text = whiteSpaceCollapse(text)

    const currentValue = element.innerText
    const range = getRange()
    const start = range[0]
    const end = range[1]
    const textLength = text.length

    text = [
        currentValue.slice(0, start),
        text,
        currentValue.slice(end, currentValue.length)
    ].join('')

    element.innerText = text
    moveCaret(element, start + textLength)
    return text
}
/*
    // < 36 33 37 38
    // > 34 39 40 18
*/
const LETF_KEYS = [36, 33, 37, 38]
const RIGHT_KEYS = [34, 39, 40, 18]
export const isDirectionKey = code => {
    return isLeftKey(code) || isRightKey(code)
}
export const isLeftKey = code => {
    return LETF_KEYS.indexOf(code) > -1
}
export const isRightKey = code => {
    return RIGHT_KEYS.indexOf(code) > -1
}

export const prevent = (event: Event) => {
    event.stopImmediatePropagation()
    event.preventDefault()
}