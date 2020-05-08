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
        if (typeof value != "string") return
        const cl = this.emojiClass
        if (cl.length > 1 && cl[1] == value) return
        cl[1] = value
    }

    get host(): HTMLElement {
        return this._hostRef.nativeElement
    }
    constructor(
        private _hostRef: ElementRef
    ) { }

}
