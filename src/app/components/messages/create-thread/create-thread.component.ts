import { Component, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ThreadTree } from 'src/app/vo/vo';
import { RteData } from '../../rte/editor/rte.component';

const rteMinLength = (lengh: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    /*
    if(control.errors && control.errors.required) {
      if(control.errors.min) {
        delete (control.errors.min)
      }
      return null
    }
    */
    let l: number = 0
    const data: RteData = control.value
    if (data) {
      l = data.length
    }
    return l < lengh ? { min: lengh } : null
  }
}
const rteRequired = (control: AbstractControl): ValidationErrors | null => {

    let l: number = 0
    const data: RteData = control.value
    if (data) {
      l = data.length
    }
    return l < 1 ? { required: true } : null
}

@Component({
  selector: 'app-create-thread',
  templateUrl: './create-thread.component.html',
  styleUrls: ['./create-thread.component.scss']
})
export class CreateThreadComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input()
  minLength: number = 4

  form: FormGroup
  constructor(
    private dialogRef: MatDialogRef<CreateThreadComponent>,
    private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      subject: ['', [Validators.required, Validators.minLength(this.minLength)]],
      content: ['', [rteRequired, rteMinLength(this.minLength)]]
    })
  }
  ngOnDestroy(): void {

  }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {

  }

  cancel() {
    this.dialogRef.close()
  }

  send() {
    const tree: ThreadTree = {
      thread: {
        subject: this.form.get("subject").value
      },
      parts: [{
        content: this.form.get("content").value
      }]
    }
    this.dialogRef.close(tree)
  }

}
