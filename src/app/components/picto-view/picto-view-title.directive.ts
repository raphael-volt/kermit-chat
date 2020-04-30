import { Directive } from '@angular/core';

@Directive({
  selector: '[picto-view-title]',
  host: { 'class': 'picto-view-title' }
})
export class PictoViewTitleDirective {

  constructor() { }

}
