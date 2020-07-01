import { Overlay } from '@angular/cdk/overlay';
import { Quill, RangeStatic, BoundsStatic } from "quill";


export class QuillProxy {
    constructor(public quill: Quill) {

    }
    //new Selection(this.scroll, this.emitter)
    get selection() {
        return this.quill["selection"]
    }
    // new Editor(this.scroll)
    get editor() {
        return this.quill['editor']
    }
    // editor ql-container ql-snow
    get container(): HTMLElement {
        return this.quill['container']
    }
    // ql-editor
    get root(): HTMLElement {
        return this.quill.root
    }
    // quill.options.scrollingContainer || this.root
    get scrollingContainer(): HTMLElement {
        return this.root
    }

    get scroll() {
        return this.quill.scroll
    }
    get savedRangeBounds(): BoundsStatic {
        return this.quill.getBounds(this.quill['selection'].savedRange)
    }
    restoreFocus() {
        const { scrollTop } = this.scrollingContainer
        this.quill.focus()
        this.scrollingContainer.scrollTop = scrollTop
    }

}

export class DownloadToolTip {

    private proxy: QuillProxy
    constructor(private quill: Quill, private overlay: Overlay) {

        this.proxy = new QuillProxy(quill)
    }

    private get range(): RangeStatic {
        return this.getSelection()
    }

    private getSelection(focus?) {
        return this.quill.getSelection(focus)

    }

    private get savedRangeBounds(): BoundsStatic {
        return this.proxy.savedRangeBounds
    }

    private restoreFocus() {
        this.proxy.restoreFocus()
    }
}