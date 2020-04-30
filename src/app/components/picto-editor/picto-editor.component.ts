import { Component, Input, ViewChild, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ImageService } from 'src/app/image/image.service';
import { first } from 'rxjs/operators';
import { ImgScrollerComponent } from '../../img-scroller/img-scroller.component';


@Component({
  selector: 'picto-editor',
  templateUrl: './picto-editor.component.html',
  styleUrls: ['./picto-editor.component.scss'],
  host: {
    class: "picto-editor"
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PictoEditorComponent {

  @ViewChild(ImgScrollerComponent)
  scroller: ImgScrollerComponent

  @Output()
  cropDone: EventEmitter<string> = new EventEmitter()

  private _picto: any
  @Input()
  set picto(value: any) {
    if (value == this._picto)
      return
    this.setPicto(value)
  }
  get picto(): any {
    return this._picto
  }

  imgData: string | File

  constructor(
    private cdr: ChangeDetectorRef,
    private imgService: ImageService,
    private dialogRef: MatDialogRef<PictoEditorComponent>) {
  }

  close() {
    this.doCrop().subscribe(result => {
      let i = new Image()
      i.src = result
      i.style.zIndex = "9999";
      i.style.position = "fixed"
      document.body.appendChild(i)
      i.onclick= ()=>{
        document.body.removeChild(i)
      }
      this.dialogRef.close(result)
    })
  }

  private doCrop() {
    return this.scroller.drawViewport()
      .pipe(first())
  }

  cancel() {
    this.dialogRef.close(null)
  }


  private setPicto(picto: any) {
    this.imgData = picto
  }
}
