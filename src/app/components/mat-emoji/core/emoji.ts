export type Emoji = {
    name: string
    order: number
}

export type EmojiMap = {
    [name: string]: EmojiList
}

export type EmojiList = Emoji[]

export type EmojiType = 'p' | 'n' | 'd' | 's' | 'a' | 't' | 'o'

export type EmojiCategory = {
    type: EmojiType
    name: string
}

const categories: EmojiCategory[] = [
    { type: 'p', name: 'ec-emoji' },
    { type: 'n', name: 'ec-eco' },
    { type: 'd', name: 'ec-restaurant' },
    { type: 's', name: 'ec-favorite' },
    { type: 'a', name: 'ec-sports' },
    { type: 't', name: 'ec-bike' },
    { type: 'o', name: 'ec-objects' }
]

export { categories }