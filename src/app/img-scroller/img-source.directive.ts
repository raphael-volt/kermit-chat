import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: 'img[imgSource]',
  host: {
    'class': 'img-source',
    '[class.loading]': 'loading',
    '[attr.src]': 'imgSource',
    '[style.transform]':'imgTransform',
  }
})
export class ImgSourceDirective {

  loading = true

  @HostListener("load")
  imgLoaded = (event) => {
    this.loading = false
  }
  
  private _imgSource: string
  get imgSource(): string {
    return this._imgSource
  }
  @Input()
  set imgSource(value: string) {
    if(this._imgSource == value) return
    this._imgSource = value
    this.loading = true
  }

  @Input()
  imgTransform
  
  constructor() { }

}
