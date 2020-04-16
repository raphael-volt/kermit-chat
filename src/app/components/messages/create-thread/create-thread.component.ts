import { Component, OnInit, ViewChild, AfterViewChecked, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ThreadTree } from 'src/app/vo/vo';

@Component({
  selector: 'app-create-thread',
  templateUrl: './create-thread.component.html',
  styleUrls: ['./create-thread.component.scss']
})
export class CreateThreadComponent implements OnInit, OnDestroy, AfterViewInit {
  form: FormGroup
  constructor(
    private dialogRef: MatDialogRef<CreateThreadComponent>,
    private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      subject: ['', [Validators.required, Validators.minLength(4)]],
      content: ['', [Validators.required, Validators.minLength(4)]]
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
