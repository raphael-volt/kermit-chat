import {
  Component, OnInit, AfterViewInit,
  OnDestroy, Input, ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ThreadTree } from 'src/app/vo/vo';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-thread',
  templateUrl: './create-thread.component.html',
  styleUrls: ['./create-thread.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateThreadComponent implements OnInit, OnDestroy, AfterViewInit {

  private requireValiator = Validators.required
  @Input()
  set minLength(value: number) {
    this.setMinLength(value, true)
  }
  setMinLength(value: number, detect = true) {
    this.contentValidator.setValidators([this.requireValiator, Validators.minLength(value)])
    this.subjectValidator.setValidators([this.requireValiator, Validators.minLength(value)])
    if (detect) {
      this.contentValidator.updateValueAndValidity()
      this.subjectValidator.updateValueAndValidity()
      this.cdr.detectChanges()
    }
  }

  form: FormGroup
  contentValidator: FormControl
  subjectValidator: FormControl

  private formSub: Subscription

  constructor(
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<CreateThreadComponent>,
    private formBuilder: FormBuilder) {

    this.contentValidator = new FormControl(null)
    this.subjectValidator = new FormControl(null)
    this.setMinLength(4, false)
    this.form = this.formBuilder.group({
      subject: this.subjectValidator,
      content: this.contentValidator
    })
    this.formSub = this.form.valueChanges.subscribe(value => {
      this.cdr.detectChanges()
    })
  }
  ngOnDestroy(): void {

    this.formSub.unsubscribe()
  }
  ngAfterViewInit(): void {

  }

  contentValidatorError() {
    const error = this.contentValidator.errors
    if (error.required)
      return 'Message est requis.'
    if (error.minlength)
      return `Message trop court (${error.minlength.actualLength}/${error.minlength.requiredLength})`
    return 'VALID'
  }

  ngOnInit(): void {

  }

  cancel() {
    this.dialogRef.close()
  }

  send() {
    const tree: ThreadTree = {
      thread: {
        subject: this.subjectValidator.value
      },
      inserts: this.contentValidator.value.content.ops
    }
    this.dialogRef.close(tree)
  }

}
