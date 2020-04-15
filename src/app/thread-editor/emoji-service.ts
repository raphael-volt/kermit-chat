import { Injectable } from "@angular/core";
import { EmojiCategory, emojiMap } from './emoji';

@Injectable({
    providedIn: 'root'
})
export class EmojiService {

    getCategories(): EmojiCategory[] {
        const categories: EmojiCategory[] = []
        for (const key in emojiMap) {
            categories.push(emojiMap[key])
        }
        return categories
    }
}