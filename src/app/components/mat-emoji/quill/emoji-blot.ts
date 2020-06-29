import Quill from "quill";

const Embed = Quill.import('blots/embed');

export class RTEEmojiBlot extends Embed {
    static create = (value: string): HTMLElement => {
        return RTEEmojiBlot.buildSpan(value)
    }
    
    static value = (node: HTMLElement) => {
        return node.innerText
    }
    static buildSpan = (emoji) => {
        
        const span = document.createElement('span')
        span.classList.add('fem')
        span.innerText = emoji
        span.contentEditable = "false"
        return span
    }

    static blotName = 'rteemoji'
    static tagName = 'span'
}