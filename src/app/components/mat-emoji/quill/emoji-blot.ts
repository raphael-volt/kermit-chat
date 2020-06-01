import Quill from "quill";
const Embed = Quill.import('blots/embed');

export class RTEEmojiBlot extends Embed {
    static create = (value): HTMLElement => {
        return RTEEmojiBlot.buildSpan(value)
    }

    static value = (node) => {
        return node.dataset.name
    }

    static buildSpan = (value) => {
        const name = (typeof value == "object") ? value.name : value
        const span = document.createElement('span')
        span.classList.add('fem', name)
        span.dataset.name = name
        return span
    }

    static blotName = 'rteemoji'
    static tagName = 'span'
}