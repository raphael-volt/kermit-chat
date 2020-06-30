import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-reply-dialog',
  templateUrl: './reply-dialog.component.html',
  styleUrls: ['./reply-dialog.component.scss'],
  host: {
    class: "fx1 fx-col"
  }
})
export class ReplyDialogComponent {

  contentControl: FormControl
  constructor(
    private ref: MatDialogRef<ReplyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) { 
    this.contentControl = data.control
  }

  send() {
    this.close(this.contentControl)
  }
  
  cancel() {
    this.close()
  }
  
  private close(value?) {
    this.ref.close(value)
  }

}
