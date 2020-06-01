import { Directive, Input } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Directive({
  selector: '[matFontIcon]',
  host: {
    '[class]':'classList'
  }
})
export class MatFontIconDirective {

  classList = ['fec']
  @Input()
  set matFontIcon(value: string) {
    this.classList[1] = value
  }
  get matFontIcon() {
    if (this.classList.length > 1)
      return this.classList[1]
    return null
  }

  @Input()
  set matFontText(value: boolean) {
    value = coerceBooleanProperty(value)
    //this.classList[0] = value ? 'mbl' : 'mbt'
  }
  get matFontText(): boolean {
    return false
  }


  constructor() { }

}
