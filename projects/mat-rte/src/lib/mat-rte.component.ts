import {
  Component, ElementRef, ViewChild, AfterViewInit, OnDestroy,
  Self, Optional, Input, ViewEncapsulation, Output, EventEmitter
} from '@angular/core';

import { ControlValueAccessor, NgControl } from '@angular/forms';
import { QuillService } from './quill.service';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject, Subscription } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { element } from 'protractor';

@Component({
  selector: 'div[mat-rte]',
  templateUrl: './mat-rte-component.html',
  styles: [
    './mat-rte-component.scss'
  ],
  host: {
    class: "mat-rte"
  },
  providers: [
    { provide: MatFormFieldControl, useExisting: MatRteComponent }
  ],
  encapsulation: ViewEncapsulation.Emulated
})
export class MatRteComponent implements OnDestroy, AfterViewInit, ControlValueAccessor, MatFormFieldControl<any> {


  @Output()
  sendShortcut: EventEmitter<void> = new EventEmitter()
  @ViewChild('editor')
  private editorRef: ElementRef<HTMLElement>
  @ViewChild('toolbar')
  private toolbarRef: ElementRef<HTMLElement>

  private _value: any
  get value(): any {
    return this._value
  }
  @Input()
  set value(value: any) {
    this._value = value
    this._onChange(value)
    this._onTouched(value)
    const control = this.ngControl
    if (control) {
      this.errorState = control.invalid
      this.stateChanges.next()
    }

  }

  private _focusSub: Subscription
  sizes
  constructor(
    private quillService: QuillService,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl) {

    this.id = "mat-rte_" + MatRteComponent._ID++
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
    this.sizes = quillService.rteConfig.quill.toolbarSizes.filter(s => {
      if (s.name == "normal") {
        return false
      }
      return true
    })
    this._focusSub = _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
      this.focused = !!origin;
      //if (this.focused)
      //this.focusEditor()
      this.stateChanges.next()
    })
    /*
    */
  }
  private static _ID = 0
  stateChanges: Subject<void> = new Subject<void>();
  id: string
  describedBy = '';
  private _placeholder: string
  get placeholder(): string {
    return this._placeholder
  }
  @Input()
  set placeholder(value: string) {
    // not working
    if (this._placeholder == value) return
    this._placeholder = value
    if (this.quill)
      this.quill.options.placeholder = value
  }
  private _focused: boolean = false
  get focused(): boolean {
    return this._focused
  }
  set focused(value: boolean) {
    if (this._focused == value) return
    this._focused = value
    console.log('rte/focus', value)
  }
  empty: boolean;
  shouldLabelFloat: boolean = true;
  @Input()
  required: boolean;
  disabled: boolean;
  errorState: boolean;
  controlType?: string = 'mat-rte';
  autofilled?: boolean;

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }
  onContainerClick(event: MouseEvent): void {
    /*
    if (this.quill)
      this.quill.focus()
      */
  }
  ngOnDestroy(): void {
    this.quill.off('text-change', this.contentChangeHandler)
    this._focusSub.unsubscribe()
  }
  writeValue(obj: any): void {
    this.content = obj
    if (this.quill)
      this.quill.setContents(obj)
  }
  private content: any

  private _onChange: (val?) => void = () => { }
  registerOnChange(fn: any): void {
    this._onChange = fn
  }
  private _onTouched: (val?) => void = () => { }
  registerOnTouched(fn: any): void {
    this._onTouched = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error("Method not implemented.");
  }
  private _focusFlag: boolean = false
  focusEditor() {
    if (this.quill) {
      return this.quill.focus()
    }
    this._focusFlag = true
  }
  private quill: any
  ngAfterViewInit(): void {
    const editor = this.editorRef.nativeElement
    const toolbar = this.toolbarRef.nativeElement
    const quill = this.quillService.getEditorInstance(toolbar, editor, this.placeholder)
    this.quill = quill
    if (this.content)
      quill.setContents(this.content)
    if (this._placeholder)
      this.quill.options.placeholder = this._placeholder
    quill.on('text-change', this.contentChangeHandler)
    if (this._focusFlag) {
      this._focusFlag = false
      this.focusEditor()
    }

    quill.keyboard.addBinding({
      key: "S",
      ctrlKey: true
    } as any, () => {
      if (this.ngControl) {
        if (this.ngControl.valid) {
          this.sendShortcut.emit()
        }
        return
      }
      this.sendShortcut.emit()
    })
    this.unsetTabIndex(this.toolbarRef.nativeElement)
  }
  private unsetTabIndex(target: ChildNode) {
    if (target instanceof HTMLElement)
      target.tabIndex = -1
    else
      return
    if ("childNodes" in target === false)
      return
    const children = target.childNodes
    const n = children.length
    for (let i = 0; i < n; i++) {
      this.unsetTabIndex(children.item(i))
    }
  }
  private contentChangeHandler = (event) => {
    this.value = this.quill.getContents()
  }
}