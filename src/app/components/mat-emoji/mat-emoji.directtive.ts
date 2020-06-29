import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
    selector: '[matEmoji]',
    host: {
        '[class]': 'emojiClass'
    }
})
export class MatEmojiDirective {

    emojiClass = ["fem"]

    @Input()
    set matEmoji(value: string) {
        if (typeof value === "string")
            this._element.innerText = value
    }
    get host(): HTMLElement {
        return this._element
    }
    private _element: HTMLElement
    constructor(
        ref: ElementRef<HTMLElement>
    ) { 
        this._element = ref.nativeElement
    }

}
