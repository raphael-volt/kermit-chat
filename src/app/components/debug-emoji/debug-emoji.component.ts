import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmojiSelectComponent } from '../mat-emoji/emoji-select/emoji-select.component';
import { FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors, Validators, FormControl } from '@angular/forms';
import { RteData } from "../rte/editor/rte.component";
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-debug-emoji',
  templateUrl: './debug-emoji.component.html',
  styleUrls: ['./debug-emoji.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebugEmojiComponent implements OnInit, OnDestroy {


  svgIcons = [
    "hash",
    "path",
    "error",
    "warning",
    "loop",
    "volume_off",
    "volume_up",
    "email",
    "add_circle",
    "remove_circle",
    "reply",
    "send",
    "insert_photo",
    "attachment",
    "camera_alt",
    "filter_vintage",
    "panorama",
    "location_history",
    "cancel",
    "refresh",
    "person",
    "account_circle",
    "autorenew",
    "cached",
    "settings",
    "replay_circle_filled"
  ]
  minLength: number = 3
  contentLength: number = 0
  private validateDataLength: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null
    let value = control.value.length
    console.log('validateDataLength', value)
    return value < this.minLength ? { 'contentLength': { 'min': this.minLength, 'actual': value } } : null
  }
  private formSub: Subscription
  form: FormGroup
  contentControl: FormControl
  constructor(private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder) {

    this.contentControl = new FormControl()
    this.contentControl.setValidators([this.validateDataLength])
    this.form = this.formBuilder.group({
      content: this.contentControl,
      subject: [null, [Validators.required]]
    })
    this.formSub = this.form.valueChanges.subscribe(value => {
      this.cdr.detectChanges()
    })
  }

  contentChange(data: RteData) {
    this.contentLength = data.length
    this.form.updateValueAndValidity()
    this.cdr.detectChanges()
  }
  ngOnInit(): void {
  }

  ngOnDestroy(): void {

    this.formSub.unsubscribe()
  }

  showEmojiSelector() {
    this.dialog.open(EmojiSelectComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: false,
      restoreFocus: true
    })
  }

}
