import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[avatarSvg]'
})
export class AvatarSvgDirective {

  @Input()
  set avatarSvg(value: any) {
    if(typeof value == "string") 
      this.ref.nativeElement.innerHTML = value
  }

  constructor(private ref: ElementRef<HTMLElement>) { 

  }

}
