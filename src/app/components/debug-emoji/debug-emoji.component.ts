import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, InjectionToken, Inject, Injector, ComponentRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DialogService } from 'src/app/dialog/dialog.service';
import { rteValidatorFn } from 'mat-rte';
import { PortalInjector, ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { first } from 'rxjs/operators';

export type CDKData = {
  name: string
}
export const CDK_DATA_TOKEN = new InjectionToken<CDKData>('cdk-data')

@Component({
  selector: 'cdk-data-dialog',
  template: `<span>{{data?.name}}</span>`,
})
export class CDKDataDialog {

  constructor(@Inject(CDK_DATA_TOKEN) public data: CDKData) {
    //console.log('CDK_DATA_TOKEN', data)
  }
}
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
    { insert: '\nLorem ipsum dolor sit ' },
    {
      insert: {
        download: {
          label: "amet consectetur",
          url: "http://google.com"
        }
      }
    },
    { insert: ', adipisicing elit.\n' },
    {
      insert: {
        download: {
          label: "Fichier-1.txt",
          url: "http://google.com"
        }
      }
    },
    {insert: "\n"},
    {
      insert: {
        download: {
          label: "Fichier-2.txt",
          url: "http://google.com"
        }
      }
    },
    {insert: "\n"},
    {
      insert: {
        download: {
          label: "Fichier-3.txt",
          url: "http://google.com"
        }
      }
    },
    {insert: "\n"},
    {
      insert: {
        download: {
          label: "Fichier-3.txt",
          url: "http://google.com"
        }
      }
    },
    {insert: "\n"},
  ]

  contentControl: FormControl
  subjectControl: FormControl

  private _overlayRef: OverlayRef
  private _componentPortal: ComponentPortal<CDKDataDialog>

  createPortal(event: MouseEvent) {
    const e: HTMLElement = event.target as HTMLElement
    console.log(e.innerText)
    e.firstChild.textContent = "Label"
    event.preventDefault()
    event.stopImmediatePropagation()
    let _oRef = this._overlayRef
    let _portal = this._componentPortal
    if (!_oRef) {
      _oRef = this._overlay.create({
        hasBackdrop: true
      })

      _portal = new ComponentPortal(CDKDataDialog, null, this.createInjector({
        name: "cdk-data"
      }))
      this._componentPortal = _portal
      this._overlayRef = _oRef
    }
    const _ref: ComponentRef<CDKDataDialog> = _oRef.attach(_portal)
    _oRef.backdropClick().pipe(first()).subscribe(_ => {
      _oRef.detach()
    })


  }
  createInjector(data: CDKData) {
    const injectorTokens = new WeakMap();
    injectorTokens.set(CDK_DATA_TOKEN, data);
    return new PortalInjector(this._injector, injectorTokens);
  }
  constructor(private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private _injector: Injector,
    private _overlay: Overlay) {

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

    if (this.form.valid) {
      this.form.reset()
    }
  }
  ngOnInit(): void {
  }

  ngOnDestroy(): void {

    this.formSub.unsubscribe()
  }

  editableInput($event) {
    console.log("input", $event)
  }
}
