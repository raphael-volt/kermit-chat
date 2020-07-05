import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, InjectionToken, Inject, Injector, ComponentRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DialogService } from 'src/app/dialog/dialog.service';
import { rteValidatorFn } from 'mat-rte';
import { PortalInjector, ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { first } from 'rxjs/operators';
import { Thread } from 'src/app/vo/vo';
import { ApiService } from 'src/app/api/api.service';
import { ContextService } from 'src/app/context.service';

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
  selector: 'debug-rte',
  templateUrl: './debug-rte.component.html',
  styleUrls: ['./debug-rte.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebugRteComponent implements OnInit, OnDestroy {


  private formSub: Subscription
  form: FormGroup

  preview: any
  model = {
    ops: [
      { insert: 'Hello ' },
      { insert: 'World!', attributes: { bold: true } },
      /*
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
      */
      { insert: "\n" },
    ]
  }

  contentControl: FormControl
  subjectControl: FormControl

  private _overlayRef: OverlayRef
  private _componentPortal: ComponentPortal<CDKDataDialog>

  createPortal(event: MouseEvent) {
    const e: HTMLElement = event.target as HTMLElement
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
  selectedIndex = 0

  get subject() {
    const d = new Date()

    return `Debug RTE[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]`
  }
  constructor(
    private api: ApiService,
    private context: ContextService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private _injector: Injector,
    private _overlay: Overlay) {

    const ctrl = new FormControl(this.model, [Validators.required, rteValidatorFn(5)])
    this.contentControl = ctrl
    this.subjectControl = new FormControl(this.subject, [Validators.required, Validators.minLength(5)])
    this.form = this.formBuilder.group({
      content: ctrl,
      subject: this.subjectControl
    })
    this.formSub = this.form.valueChanges.subscribe(value => {
      this.model = value.content
      this.cdr.detectChanges()
    })
  }
  thread: Thread
  send() {
    if (this.form.invalid) return
    const userId = this.context.user.id
    let threadId
    const done = (result?) => {
      if (result)
        this.preview = result
      else
        this.preview = null
      this.model.ops = []
      this.contentControl.setValue(this.model)
      this.contentControl.updateValueAndValidity()
      this.selectedIndex = this.preview ? 1 : 0
      this.cdr.detectChanges()
    }
    if (!this.thread) {
      const thread = {
        subject: this.subjectControl.value,
        user_id: userId
      }
      const tree = {
        thread: thread,
        inserts: this.contentControl.value.ops
      }
      this.api.addTread(tree).pipe(first()).subscribe(data => {
        this.thread = tree.thread
        threadId = this.thread.id
        this.api.getThreadData(threadId, userId).pipe(first()).subscribe(data=>{
          done({ ops: data.inserts })
        })
      },
        err => {
          console.error(err)
          done()
        })
    }
    else {
      threadId = this.thread.id
      this.api.reply({
        content: this.contentControl.value.ops,
        thread_id: threadId,
        user_id: userId
      }).pipe(first()).subscribe(data => {
        done({ ops: data.content })
      })
    }
  }
  ngOnInit(): void {
    //setTimeout(()=>this.send(), 1000)
  }

  ngOnDestroy(): void {

    this.formSub.unsubscribe()
  }

  editableInput($event) {
    console.log("input", $event)
  }
}
