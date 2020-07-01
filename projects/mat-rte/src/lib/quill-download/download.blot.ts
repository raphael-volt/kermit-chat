import { DownloadData, DOWNLOAD } from '../quill';
import Quill from "quill";
const Embed = Quill.import('blots/embed')

const DD_KEYS_LIST: string[] = ["url", "label", "file"]
const FILE_KEYS: string[] = ["size", "ext", "name", "id", "mime"]
const LABEL_WRAPPER: string = "label-wrapper"

const getWrapper = (node: HTMLElement): HTMLSpanElement => node.querySelector(`.${LABEL_WRAPPER}`) as HTMLSpanElement
const getLabel = (node: HTMLElement) => {
    const child = getWrapper(node)
    if (child)
        return child.innerText
    return undefined
}
const appendSpan = (node: HTMLElement, ...tokens) => {
    const child = document.createElement('span')
    child.classList.add(...tokens)
    child.contentEditable = "false"
    return node.appendChild(child) as HTMLSpanElement
}

const createChildren = (parent: HTMLElement, data: DownloadData) => {
    parent.setAttribute('target', '_blank')
    const node: HTMLElement = appendSpan(parent, 'mat-raised-button',
        'mat-button-base', 'mat-accent', 'label-wrapper', 'file_download')
    setData(parent, data, node)
    return parent
}


const setData = (node: HTMLElement, data: DownloadData, wrapper: HTMLElement = null) => {
    if (!wrapper)
        wrapper = getWrapper(node)
    let text: string = data.label
    if (!text) text = ""
    wrapper.innerText = text
    text = data.url
    let key: string = 'href'
    if (text)
        node.setAttribute(key, text)
    else if (node.hasAttribute(key))
        node.removeAttribute(key)
    setFileData(node, data.file)
}
const setFileData = (node: HTMLElement, file: DownloadData['file']) => {
    if (file) {
        node.dataset.file = JSON.stringify(file)
    }
    else delete node.dataset.file
}

export class DownloadBlot extends Embed {
    static ID = 0
    static className: string = `ql-${DOWNLOAD}`
    static blotName: string = DOWNLOAD
    static tagName: string = 'a'

    id: number
    constructor(public domNode: HTMLElement, public downloadData: DownloadData) {
        super(domNode, downloadData)
        this.id = DownloadBlot.ID++
    }

    static formats(node: HTMLElement) {
        return false
    }
    
    static value(node: HTMLElement): DownloadData {
        /*return {
            url: node.getAttribute("href"),
            label: getLabel(node)
            return DownloadBlot.formats(node)
        }*/
        const formats: DownloadData = {}
        if (node.hasAttribute('href'))
            formats.url = node.getAttribute('href')
        const label = getLabel(node)
        if (label)
            formats.label = label
        formats.file = {}
        const dataset = node.dataset
        let file = {}
        let hasFile = ("file" in dataset)
        if (dataset.file)
            formats.file = JSON.parse(dataset.file)
        return formats
    }

    static create(value) {
        const node = super.create(value) as HTMLAnchorElement
        return createChildren(node, value)
    }

    static setLabel(value: string, node: HTMLElement) {
        const wrapper = getWrapper(node)
        if (wrapper)
            wrapper.innerText = value
    }
    formatAt(i, l, name, value: DownloadData) {
        for (const key in value) {
            this.format(key, value[key])
        }
    }
    format(name, value) {
        if (DD_KEYS_LIST.indexOf(name) > -1) {
            console.log(this.id, "DownloadBlot format", name, value)
            const node = this.domNode
            const k: string = name
            switch (k) {
                case "label":
                    const e = getWrapper(this.domNode)
                    if (typeof value !== 'string')
                        value = ""
                    e.innerText = value
                    break
                case "url":
                    if (value)
                        node.setAttribute('href', value)
                    else
                        if (node.hasAttribute('href'))
                            node.removeAttribute('href')
                    break
                case "file": {
                    setFileData(node, value)
                    break
                }
                default:
                    break;
            }
        } else {
            //super.format(name, value);
        }
    }

}