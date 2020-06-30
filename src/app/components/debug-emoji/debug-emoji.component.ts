import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DialogService } from 'src/app/dialog/dialog.service';
import { rteValidatorFn } from 'mat-rte';
@Component({
  selector: 'app-debug-emoji',
  templateUrl: './debug-emoji.component.html',
  styleUrls: ['./debug-emoji.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebugEmojiComponent implements OnInit, OnDestroy {


  private formSub: Subscription
  form: FormGroup

  model = [
    { insert: 'Hello ' },
    { insert: 'World!', attributes: { bold: true } },
    { insert: '\n' }
  ]

  contentControl: FormControl
  subjectControl: FormControl
  
  constructor(private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private dialogService: DialogService) {

    const ctrl = new FormControl(this.model, [Validators.required, rteValidatorFn(5)])
    this.contentControl = ctrl
    this.subjectControl = new FormControl("My message", [Validators.required, Validators.minLength(5)])

    this.form = this.formBuilder.group({
      content: ctrl,
      subject: this.subjectControl
    })
    this.formSub = this.form.valueChanges.subscribe(value => { 
      this.model = value.content
      this.cdr.detectChanges()
    })
  }
  sendShortcut() {
    console.log('sendShortcut', this.form.valid);
    
    if(this.form.valid) {
      this.form.reset()
    }
  }
  ngOnInit(): void {
  }

  ngOnDestroy(): void {

    this.formSub.unsubscribe()
  }

}
