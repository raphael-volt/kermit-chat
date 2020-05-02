import { Component, Input, ViewChild, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { ImgScrollerComponent } from '../../img-scroller/img-scroller.component';
import { coerceBooleanProperty } from '@angular/cdk/coercion';


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

  @Input()
  showHelp = true
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

  isDialog = false
  constructor(
    private cdr: ChangeDetectorRef,
    @Optional() private dialogRef: MatDialogRef<PictoEditorComponent>) {
      this.isDialog = coerceBooleanProperty(dialogRef)
  }


  close() {
    this.doCrop().subscribe(result => {
      if(this.dialogRef)
        return this.dialogRef.close(result)
      this.cropDone.next(result)
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
