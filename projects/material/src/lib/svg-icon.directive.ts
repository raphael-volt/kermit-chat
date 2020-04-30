import { Directive, Input, ElementRef } from '@angular/core';
import { IconService } from './icon.service';

@Directive({
  selector: 'use[useHref]'
})
export class SvgIconDirective {

  @Input()
  set useHref(value:any) {
    if(value)
      this.ref.nativeElement.setAttributeNS("http://www.w3.org/1999/xlink", 'href', "#"+value)
  }
  constructor (
    private ref: ElementRef<HTMLElement>) { 

  }

}
