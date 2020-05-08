import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[emojiDec]'
})
export class EmojiDecDdirective {

    @Input()
    set emojiDec(value) {
        if(value) {
            this.elmt.innerHTML = value
        }
        `
        lkjj
        
        ﻿5⃣﻿
        
        
        
        mùml`
    }

    private elmt: HTMLElement
    constructor(ref: ElementRef<HTMLElement>) {
        this.elmt = ref.nativeElement
    }
}