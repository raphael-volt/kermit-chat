import Quill from 'quill'
import { EmojiSelectComponent } from '../emoji-select/emoji-select.component';
import { first } from "rxjs/operators";
import { Emoji } from '../core/emoji';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

const Module = Quill.import('core/module')

export class RTEEmojiToolbar extends Module {

    static dialog: MatDialog

    static DEFAULTS = {
        buttonIcon: '<svg viewbox="0 0 18 18"><circle class="ql-fill" cx="7" cy="7" r="1"></circle><circle class="ql-fill" cx="11" cy="7" r="1"></circle><path class="ql-stroke" d="M7,10a2,2,0,0,0,4,0H7Z"></path><circle class="ql-stroke" cx="9" cy="9" r="6"></circle></svg>'
    }
    
    private backdropSub: Subscription
    private emojiSub: Subscription
    private quill: Quill
    private range: {index: number}
    private format: any
    get container(): HTMLDivElement {
        return this.quill['container']
    }

    constructor(quill: Quill, options: any) {
        super(quill, options)
        this.quill = quill
        const toolbar = quill.getModule('toolbar')
        toolbar.addHandler('rteemoji', this.openPopup)
        const emojiBtns = document.getElementsByClassName('ql-rteemoji')
        if (emojiBtns && "buttonIcon" in options) {
            for (let i = 0; i < emojiBtns.length; i++) {
                emojiBtns.item(i).innerHTML = options.buttonIcon
            }
        }
    }


    private close = (emoji: Emoji = null) => {
        const quill = this.quill
        if (emoji) {
            const range = this.range
            quill.insertEmbed(range.index, 'rteemoji', emoji.name)
            const format = this.format
            const index = range.index
            for (const key in format) {
                quill.formatText(index, 1, key, format[key])
            }
            quill.setSelection(index + 1, 0)
        }
        this.backdropSub.unsubscribe()
        this.emojiSub.unsubscribe()
        quill.focus()
    }
    
    private openPopup = (flag: boolean) => {
        const quill = this.quill
        quill.focus()
        const range = quill.getSelection()
        this.format = quill.getFormat(range)
        const bounds = quill.getBounds(range.index)
        this.range = range
        const offset: DOMPoint = new DOMPoint(bounds.left, bounds.top)
        const dialog = RTEEmojiToolbar.dialog
        const ref = dialog.open(EmojiSelectComponent, {
            hasBackdrop: true,
            backdropClass: 'backdrop-transparent',
            disableClose: false,
            panelClass: 'dialog-container-transparent',
            autoFocus: false,
            restoreFocus: true
        })
        const popup = ref.componentInstance
        popup.viewInit.pipe(first()).subscribe(bounds => {
            const p = this.updatePopupPosition(bounds, offset)
            ref.updatePosition({
                left: p.x + 'px',
                top: p.y + 'px',
            })
        })
        this.backdropSub = ref.backdropClick().subscribe(()=>{
            this.close()
        })
        this.emojiSub = popup.emojiClick.subscribe(emoji => {
            ref.close()
            this.close(emoji)
        })
    }

    private updatePopupPosition(popupBounds: DOMRect, offset: DOMPoint) {
        const outletBounds = this.container.getBoundingClientRect()
        const position: DOMPoint = new DOMPoint(offset.x, offset.y)
        const popupW = popupBounds.width
        const popupH = popupBounds.height
        const outletW = outletBounds.width
        const outletH = outletBounds.height
        const x = position.x
        const y = position.y
        
        if (popupW + x > outletW) {
            if (x - popupW > 0)
                position.x = x - popupW
            else 
                position.x = 0
        }

        if (popupH + y > outletH) {
            if (y - popupH > 0)
                position.y = outletH - popupH
            else
                position.y = y - popupH
        }
        
        position.x += outletBounds.left
        position.y += outletBounds.top
        return position
    }
}