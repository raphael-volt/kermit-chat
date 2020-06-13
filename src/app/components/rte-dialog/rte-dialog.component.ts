import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { RteData } from '../rte/editor/rte.component';

@Component({
  selector: 'app-rte-dialog',
  templateUrl: './rte-dialog.component.html',
  styleUrls: ['./rte-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RteDialogComponent implements OnInit {

  private _formSub: Subscription

  private _formControl: FormControl
  @Input()
  set messageControl(value: FormControl) {
    this._formControl = value

    if (value) {
      this._formSub = value.statusChanges.subscribe(_ => {
        this.cdr.detectChanges()
      })
    }
  }

  get messageControl(): FormControl {
    return this._formControl
  }

  constructor(private cdr: ChangeDetectorRef, private ref: MatDialogRef<RteDialogComponent>) {

  }

  ngOnInit(): void {
  }

  cancel() {
    this.ref.close()
  }
  send() {
    this.ref.close(this._formControl.value)

  }
}
