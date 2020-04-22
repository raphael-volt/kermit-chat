import { Directive, ElementRef, OnDestroy, Input } from '@angular/core';

@Directive({
  selector: '[refreshList]'
})
export class RefreshListDirective implements OnDestroy {

  private transitionFlag = false
  private trigger
  @Input()
  set refreshList(value) {

    if (value) {
      if ('_elementRef' in value && "nativeElement" in value._elementRef) {
        this.handleTarget(value._elementRef.nativeElement)
      }
    }
  }
  
  constructor(private ref: ElementRef<HTMLElement>) {
    ref.nativeElement.addEventListener('transitionend', this.transitionHandler)
    this.handleTarget(ref.nativeElement)
  }
  
  ngOnDestroy(): void {
    if (this.trigger)
    this.trigger.removeEventListener('mousedown', this.clickHandler)
    this.ref.nativeElement.removeEventListener('transitionend', this.transitionHandler)
  }

  private handleTarget(value: HTMLElement) {
    if (this.trigger == value)
      return
    if (this.trigger) {
      this.trigger.removeEventListener('mousedown', this.clickHandler)
    }
    this.trigger = value
    if (!value)
      return
    this.trigger.addEventListener('mousedown', this.clickHandler)
  }

  private transitionHandler = () => {
    const e = this.ref.nativeElement
    e.style.transition = "none"
    e.style.transform = "none"
    this.transitionFlag = false
  }

  private clickHandler = () => {
    if (this.transitionFlag) return
    this.transitionFlag = true

    const e = this.ref.nativeElement
    e.style.transition = "transform .3s ease-out"
    e.style.transform = "rotate(-360deg)"
  }
}
