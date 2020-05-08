import { Component } from "@angular/core";
import { Emoji, emojiList } from './list';
type EmojiType = {
    type: 'p' | 'n' | 'd' | 's' | 'a' | 't' | 'o' | 'f'
    name: string
    class: string
}
@Component({
    selector:'emoji-panel', 
    templateUrl: './emoji-panel.component.html',
    styleUrls: ['emoji-panel.component.scss']
})
export class EmojiPanelComponent {
    types: EmojiType[] = [
        { type: 'p', name: 'people', class: "i-people" },
        { type: 'n', name: 'nature', class: "i-nature" },
        { type: 'd', name: 'food', class: "i-food" },
        { type: 's', name: 'symbols', class: "i-symbols" },
        { type: 'a', name: 'activity', class: "i-activity" },
        { type: 't', name: 'travel', class: "i-travel" },
        { type: 'o', name: 'objects', class: "i-objects" },
        { type: 'f', name: 'flags', class: "i-flags" }
    ];

    constructor() {
        this.selectItems(this.types[0])
    }
    selectedType: string

    emojiClick(emoji: Emoji) {

    }

    items: Emoji[]

    selectItems(emojiType: EmojiType) {
        const t = emojiType.type
        this.selectedType = t
        this.items = emojiList.filter(e => e.category == t).sort((a, b) => {
            return a.emoji_order - b.emoji_order
        })
    }


}