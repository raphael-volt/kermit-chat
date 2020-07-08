import { Directive, ElementRef, Input } from '@angular/core';
import { QuillService } from './quill.service';

@Directive({
  selector: 'div[matRteView]',
  host: {
    class: "rte-view ql-editor ql-snow"
  } 
})
export class MatRteViewDirective {

  private element: HTMLElement
  @Input()
  set matRteView(value: any) {
    this.element.innerHTML = this.service.deltaToHTML(value)
  }
  constructor(private service: QuillService, ref: ElementRef<HTMLDivElement>) { 
    this.element = ref.nativeElement
  }
}
