import Quill from 'quill';
import { emojiMap } from "./emoji/list";
const Embed = Quill.import('blots/embed');


export class EmojiBlot extends Embed {

    static blotName = 'emoji';
    static className = 'ql-emojiblot';
    static tagName = 'span';
    static emojiClass = 'ap';
    static emojiPrefix = 'ap-';

    static create(value) {
        let node = super.create();
        if (typeof value === 'object') {

            EmojiBlot.buildSpan(value, node);
        } else if (typeof value === "string") {
            const valueObj = emojiMap[value];

            if (valueObj) {
                EmojiBlot.buildSpan(valueObj, node);
            }
        }

        return node;
    }

    static value(node) {
        return node.dataset.name;
    }

    static buildSpan(value, node) {
        console.log('EmojiBlot::buildSpan')
        node.setAttribute('data-name', value.name);
        let emojiSpan = document.createElement('span');
        emojiSpan.classList.add(EmojiBlot.emojiClass);
        emojiSpan.classList.add(EmojiBlot.emojiPrefix + value.name);
        // unicode can be '1f1f5-1f1ea',see emoji-list.js.
        emojiSpan.innerText = String.fromCodePoint(...EmojiBlot.parseUnicode(value.unicode));
        node.appendChild(emojiSpan);
    }
    static parseUnicode(string) {
        return string.split('-').map(str => parseInt(str, 16));
    }

}

/*

EmojiBlot.blotName = 'emoji';
EmojiBlot.tagName = 'span';

Quill.register({
    'formats/emoji': EmojiBlot
}, true);
*/