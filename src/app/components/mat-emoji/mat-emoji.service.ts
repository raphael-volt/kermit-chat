import { Injectable } from '@angular/core';
import { categories, EmojiType, EmojiList } from './core/emoji';
import { emojiMap } from './core/emoji-map';

@Injectable({
  providedIn: 'root'
})
export class MatEmojiService {

  constructor() { }

  selectedIndex = 0

  getCategories() {
    return categories.slice()
  }

  getEmojiList(emojiType: EmojiType): EmojiList {
    const map = emojiMap
    if (map[emojiType] === undefined)
      return null

    return map[emojiType]
  }

}
