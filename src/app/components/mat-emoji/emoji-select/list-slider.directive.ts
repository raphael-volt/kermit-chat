import { ElementRef, Directive, HostListener, Output, EventEmitter } from '@angular/core';

export type SlideDirection = 'left' | 'right'
export type SlideMode = 'show' | 'hide'
const isSliderMode = (value: any): value is SlideMode => {
    if (typeof value == "string")
        return (value == 'show' || value == 'hide')

    return false
}
const isSliderDirection = (value: any): value is SlideDirection => {
    if (typeof value == "string")
        return (value == 'left' || value == 'right')

    return false
}
const ACTIVE = "active"
const HIDE = "hide"
const SHOW = "show"
@Directive({
    selector: '[slideList], slideList'
})
export class ListSliderDirective {

    private static _ID = 1
    
    private _id: number
    get id(): number {
        return this._id
    }

    @Output()
    animationsChange: EventEmitter<string> = new EventEmitter()
    
    @HostListener('animationstart', ['$event'])
    animationstart(event: AnimationEvent) {
        this.animationsChange.next(event.type)
        this.logClass('start')
    }

    @HostListener('animationend', ['$event'])
    animationend(event: AnimationEvent) {
        const cl = this.classList

        if(this._slideMode == "hide") {
            this.removeClass(ACTIVE)
        }
        this.removeClass(this._slideDirection, this._slideMode)
        this.logClass('done')
        this.animationsChange.next(event.type)
    }
    private logClass(v) {
        //console.log(v, this.id, this.classList.toString())
    }

    private _slideMode: SlideMode
    private _slideDirection: SlideDirection
    private _host: HTMLElement

    constructor(ref: ElementRef) {
        this._id = ListSliderDirective._ID++
        this._host = ref.nativeElement
        this.addClass('list-slider')
    }

    show(from: SlideDirection) {
        if (isSliderDirection(from)) {
            this._slideMode = "show"
            this._slideDirection = from
            this.addClass(from, this._slideMode, ACTIVE)
        }
    }

    hide(to: SlideDirection) {
        if (isSliderDirection(to)) {
            this._slideMode = "hide"
            this._slideDirection = to
            this.addClass(to, this._slideMode)
        }
    }

    private addClass(...values: string[]) {
        const cl = this.classList
        for (const value of values) {
            if (!cl.contains(value))
                cl.add(value)
        }
    }

    private removeClass(...values: string[]) {
        const cl = this.classList
        for (const value of values) {
            if (cl.contains(value))
                cl.remove(value)

        }
    }

    private get classList() {
        return this._host.classList
    }
}