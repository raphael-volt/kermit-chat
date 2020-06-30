import {
  Component, OnInit, OnDestroy,
  Input, ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ThreadTree } from 'src/app/vo/vo';
import { Subscription } from 'rxjs';
import { rteValidatorFn } from 'mat-rte';

@Component({
  selector: 'app-create-thread',
  templateUrl: './create-thread.component.html',
  styleUrls: ['./create-thread.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'fx1 fx-col'
  }
})
export class CreateThreadComponent implements OnInit, OnDestroy {

  private requireValiator = Validators.required
  @Input()
  set minLength(value: number) {
    this.setMinLength(value, true)
  }
  setMinLength(value: number, detect = true) {
    this.contentControl.setValidators([this.requireValiator, rteValidatorFn(value)])
    this.subjectControl.setValidators([this.requireValiator, Validators.minLength(value)])
    if (detect) {
      this.contentControl.updateValueAndValidity()
      this.subjectControl.updateValueAndValidity()
      this.cdr.detectChanges()
    }
  }


  form: FormGroup
  contentControl: FormControl
  subjectControl: FormControl

  private formSub: Subscription

  constructor(
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<CreateThreadComponent>,
    private formBuilder: FormBuilder) {

    this.contentControl = new FormControl(null)
    this.subjectControl = new FormControl(null)
    this.setMinLength(5, false)
    this.form = this.formBuilder.group({
      subject: this.subjectControl,
      content: this.contentControl
    })
    this.formSub = this.form.valueChanges.subscribe(value => {
      this.cdr.detectChanges()
    })
  }
  sendShortcut() {
    if (this.form.valid) {
      this.send()
    }
  }
  ngOnDestroy(): void {

    this.formSub.unsubscribe()
  }

  ngOnInit(): void {

  }

  cancel() {
    this.dialogRef.close()
  }

  send() {
    const tree: ThreadTree = {
      thread: {
        subject: this.subjectControl.value
      },
      inserts: this.contentControl.value.ops
    }
    this.dialogRef.close(tree)
  }

}
