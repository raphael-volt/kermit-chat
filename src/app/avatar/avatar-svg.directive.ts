import { Directive, Input, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AvatarService } from './avatar.service';

@Directive({
  selector: '[avatarSvg]'
})
export class AvatarSvgDirective {

  @HostBinding('src')
  sanitized
  @Input()
  set avatarSvg(value: any) {
    if(typeof value == "string") 
      this.sanitized = this.dm.bypassSecurityTrustUrl(this.avatars.svgToObjectURL(value))
  }

  constructor(private dm: DomSanitizer, private avatars: AvatarService) { 

  }

}
