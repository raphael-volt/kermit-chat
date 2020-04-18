import { Component, OnInit, ViewChild, AfterViewInit, Input, ElementRef, OnDestroy, forwardRef, Injector, HostBinding, Optional, Self } from '@angular/core';
import { QuillEditorComponent, ContentChange, Focus, Blur } from 'ngx-quill';
import { Subscription, Subject } from 'rxjs';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export type RteData = {
  length: number
  content: any
}

@Component({
  selector: 'mat-rte',
  templateUrl: './rte.component.html',
  styleUrls: ['./rte.component.scss'],
  host: {
    class: 'v-box',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy'
  },
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: RteComponent
    }
  ]
})
export class RteComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor, MatFormFieldControl<RteData> {

  /**
   * Work fine, but dropdowns open on bottom...
   */
  @Input()
  editorBottom = false

  @ViewChild(QuillEditorComponent)
  editor: QuillEditorComponent

  private subs: Subscription[] = []


  private _value: RteData
  @Input()
  set value(value: RteData) {
    if (typeof value !== "object") {
      value = { length: 0, content: {} }
    }

    this._value = value
    if (this.editor)
      this.setEditorContent(value.content)
    this._onChange(value)
    this.stateChanges.next()
  };
  get value(): RteData {
    return this._value
  }

  stateChanges: Subject<void> = new Subject<void>()
  static nextId = 0;
  @HostBinding() id = `mat-rte-${RteComponent.nextId++}`;
  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;
  ngControl: NgControl
  focused: boolean;
  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return true;
  }
  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false
  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }
  private _disabled = false;

  errorState: boolean;
  controlType: string = "richeditor";
  autofilled?: boolean;

  get empty() {
    return this.editorText ? false : true;
  }

  private get editorText(): string {
    if (this.editor) {
      return this.editor.quillEditor.getText().trim()
    }
    return null
  }

  @HostBinding('attr.aria-describedby') describedBy = '';
  private _touched = false

  constructor(
    public elementRef: ElementRef,
    private fm: FocusMonitor,
    @Optional() @Self() public ngControl: NgControl) {

    if (fm)
      this.sub = fm.monitor(elementRef.nativeElement, true).subscribe(origin => {
        this.focused = !!origin;
        this.stateChanges.next()
      })

    if (ngControl != null)
      ngControl.valueAccessor = this
  }

  ngAfterViewInit(): void {
    const rte = this.editor
    this.sub = rte.onContentChanged.subscribe((event: ContentChange) => {
      const data = { length: event.text.trim().length, content: event.content }
      this._value = data
      this._onChange(data)
      this._ngDoCheck()
    })
    this.sub = rte.onFocus.subscribe((focus: Focus) => {
      this.focused = true
      if (!this._touched) {
        this._touched = true
        this._onTouched()
      }
      this.stateChanges.next()
    })
    this.sub = rte.onBlur.subscribe((blur: Blur) => {
      this.focused = false
      this._ngDoCheck()
    })
  }


  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }
  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() != 'div') {
      ///
    }
  }
  writeValue(obj: any): void {
    this._value = obj
    this.setEditorContent(obj)
  }

  private setEditorContent(value) {
    if (this.editor)
      this.editor.quillEditor.setContents(value)
  }

  private _onChange = (value: any) => {

  }
  registerOnChange(fn: any): void {
    this._onChange = fn
  }
  private _onTouched = () => {

  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn
  }

  private _ngDoCheck(): void {
    if (this.ngControl) {
      this.errorState = this.ngControl.invalid && this.ngControl.touched;
    }
    this.stateChanges.next()
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    for (const sub of this.subs) {
      sub.unsubscribe()
    }
    this.stateChanges.complete()
    if (this.fm)
      this.fm.stopMonitoring(this.elementRef.nativeElement)
  }

  private set sub(value: Subscription) {
    this.subs.push(value)
  }

}
