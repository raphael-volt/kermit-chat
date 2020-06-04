import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, Input, OnDestroy, Optional, Self, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormGroup, ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';

import Quill, { Delta } from 'quill'
import { MatDialog } from '@angular/material/dialog';
import { RTEEmojiToolbar } from "../../mat-emoji/quill/emoji-toolbar";

export class RteData {
    constructor(
        public content: Delta = null,
        public length: number = 0) {
    }
    clone() {
        return new RteData(this.content, this.length)
    }
}
@Component({
    selector: 'mat-rte',
    templateUrl: './rte.component.html',
    styleUrls: ['./rte.component.scss'],
    host: {
        "class": "rte editor",
        '[id]': 'id',
        '[attr.aria-describedby]': 'describedBy',
        '[class.rte-floating]': 'shouldLabelFloat',
    },
    providers: [{ provide: MatFormFieldControl, useExisting: RteComponent }]
})
export class RteComponent implements ControlValueAccessor, MatFormFieldControl<RteData>, OnDestroy {
    static ngAcceptInputType_disabled: boolean | string | null | undefined;
    static ngAcceptInputType_required: boolean | string | null | undefined;
    static nextId = 0;

    private _minLength: number = 0
    @Input()
    get minLength(): number {
        return this._minLength
    }
    set minLength(value: number) {
        if (typeof value == "string")
            value = parseInt(value)
        if (typeof value !== "number")
            value = 0
        else
            if (isNaN(value) || value < 0)
                value = 0
        if (this._minLength == value) return

        this._minLength = value
        this.checkErrorState()
    }

    private quill: Quill
    stateChanges = new Subject<void>();
    private _touched: boolean = false
    private _focused: boolean = false
    private _blur: boolean = false
    get focused(): boolean {
        return this._focused
    }
    set focused(value: boolean) {
        if (this._focused == value) return
        this._focused = value
        if (!value && !this._blur) {
            this._blur = true
            this._touched = true
            this.checkErrorState()
        }
    }
    errorState = false;
    controlType = 'mat-rte';
    id = `mat-rte-${RteComponent.nextId++}`;
    describedBy = '';

    constructor(
        dialog: MatDialog,
        private _focusMonitor: FocusMonitor,
        private _elementRef: ElementRef<HTMLElement>,
        @Optional() @Self() public ngControl: NgControl) {

        // @TODO Inject MatDialog in RTEEmojiToolbar constructor 
        RTEEmojiToolbar.dialog = dialog

        _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
            this.focused = !!origin;
            if (this.focused)
                this.focusEditor()
            this.stateChanges.next();
        });

        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
        this._value = new RteData()
    }

    onChange = (_: any) => { };
    onTouched = () => { };

    get empty() {
        const value = this._value
        return !value || value.length == 0;
    }

    get shouldLabelFloat() { return this.focused || !this.empty; }

    private _placeholder: string = "";
    @Input()
    get placeholder(): string { return this._placeholder; }
    set placeholder(value: string) {
        this._placeholder = value;
        this.stateChanges.next();
    }

    private _required = false;
    @Input()
    get required(): boolean { return this._required; }
    set required(value: boolean) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }

    private _disabled = false;
    @Input()
    get disabled(): boolean { return this._disabled; }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this.stateChanges.next();
    }

    private _value: RteData = null
    @Input()
    get value(): RteData | null {
        return this._value;
    }
    set value(data: RteData | null) {
        if (!data)
            data = new RteData()
        this._value = data
        if(this.quill) {
            this.quill.setContents(data.content)
        }
        this.stateChanges.next();
    }



    ngOnDestroy() {
        this.stateChanges.complete();
        this._focusMonitor.stopMonitoring(this._elementRef);
        const quill = this.quill
        if (quill)
            quill.off('text-change', this.textChangeHandler)
    }

    setDescribedByIds(ids: string[]) {
        this.describedBy = ids.join(' ');
    }

    private _focusFlag: boolean = false
    focusEditor() {
        const quill = this.quill
        if (quill) {
            this.focused = true
            quill.focus()
            this.stateChanges.next()
            return
        }
        this._focusFlag = true
    }

    onContainerClick(event: MouseEvent) {
        if (this.focused)
            return
        let e: Element = event.target as Element
        if (!e.classList.contains('ql-editor')) {
            this.quill.focus()
        }
        this.focused = true
        this.checkErrorState()
    }

    writeValue(rteData: RteData | null): void {
        this.value = rteData;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onEditorCreated(quill: Quill) {
        this.quill = quill
        quill.on('text-change', this.textChangeHandler)
        this.textChangeHandler(null)
        if (this._focusFlag) {
            this._focusFlag = false
            this.focused = true
            if(this._value)
                quill.setContents(this._value.content)
            
            quill.focus()
            this.checkErrorState()
        }
    }

    private checkErrorState() {
        const ngc = this.ngControl
        if (!ngc)
            return
        let old = this.errorState
        const errorState = ngc.invalid && this._touched
        if (errorState == old) return
        this.errorState = errorState
    }
    private updateRteData() {
        const quill = this.quill
        const data = this._value
        if (!quill || !data) return
        const delta = quill.getContents()
        data.content = delta
        let n = quill.getText().replace(/\s+/g, '').length
        for (const i of delta.ops) {
            if (typeof i.insert == "string") continue
            n++ // image, emoji, ...
        }
        data.length = n
        return data
    }

    @Output()
    contentChange: EventEmitter<RteData> = new EventEmitter()

    private notifyChange(value: RteData = null) {
        if (!value)
            value = this._value
        this.contentChange.emit(value)
    }
    private textChangeHandler = (delta: Delta, ...args) => {
        const v = this.updateRteData()
        this.onChange(v.clone())
        this.checkErrorState()
        this.notifyChange()
        this.stateChanges.next()

    }
}
