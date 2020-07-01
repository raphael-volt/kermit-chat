import {
  Component, Input, EventEmitter,
  ViewChild, ElementRef, AfterViewInit,
  Output, Inject, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { DownloadData, QLCaretPosition, DownloadTooltipData, DOWNLOAD_TOOLTIP_DATA } from '../../quill';
import { removeRange, isDirectionKey, getCarretPosition, isLeftKey, prevent, isRightKey, isReturnCode, paste, moveCaret, focus } from './content-editor.utils';

@Component({
  selector: 'ql-download-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QLDownloadTooltip implements AfterViewInit, OnDestroy {

  @Output()
  change: EventEmitter<DownloadData> = new EventEmitter<DownloadData>()
  @Output()
  close: EventEmitter<DownloadTooltipData> = new EventEmitter<DownloadTooltipData>()

  @ViewChild("file")
  inputRef: ElementRef<HTMLInputElement>
  @ViewChild("wrapper")
  wrapperRef: ElementRef<HTMLSpanElement>
  @ViewChild("textField")
  textFieldRef: ElementRef<HTMLSpanElement>
  private get textField() {
    return this.textFieldRef.nativeElement
  }
  @Input()
  placeholder: string = "mon fichier"
  inputText: string
  
  private get downloadData() {
    return this.dialoData.data
  }
  private set dataLabel(value: string) {
    this.downloadData.label = value
    this.notify()
  }

  viewInitialized = false

  constructor(
    @Inject(DOWNLOAD_TOOLTIP_DATA) public dialoData: DownloadTooltipData,
    private cdr: ChangeDetectorRef) {
    this.inputText = this.initLabel()
  }


  private initLabel() {
    let data = this.downloadData
    if (data) {
      if (!data.label) {
        if (data.file && data.file.name)
          data.label = data.file.name
        else
          data.label = ""
      }
    }
    else {
      data = { label: "" }
      this.dialoData.data = data
    }
    return data.label

  }

  private carretPosition: number
  triggerClick(event: MouseEvent) {
    moveCaret(this.textField, this.carretPosition)
    this.inputRef.nativeElement.click()
    event.preventDefault()
  }

  fileChange(event: Event) {
    const i = event.target as HTMLInputElement
    const file = i.files[0]
    this.dialoData.file = file
    this.dialoData.data.file = {
      name: file.name,
      size: file.size,
      mime: file.type,
      ext: file.name.split(".").pop()
    }
    this.notify()
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.viewInitialized = true
      this.setCarretPosition(this.dialoData.position)
      this.cdr.detectChanges()
    })
    const tf = this.textField
    tf.dataset.placeholder = this.placeholder
    tf.addEventListener('keydown', this.keydownHandler)
    tf.addEventListener('paste', this.pasteHandler)
    document.addEventListener('selectionchange', this.selectionChangeHandler)
  }
  private selectionChangeHandler = (event) => {
    const sel = document.getSelection()
    const r = sel.getRangeAt(0)
    this.carretPosition = r.startOffset
  }
  ngOnDestroy(): void {
    const tf = this.textField
    tf.removeEventListener('keydown', this.keydownHandler)
    tf.removeEventListener('paste', this.pasteHandler)
    document.removeEventListener('selectionchange', this.selectionChangeHandler)
  }
  inputHandler(event?: InputEvent) {
    this.carretPosition = getCarretPosition()
    this.dataLabel = this.textField.innerText
    this.notify()
  }

  private selectOutHandler(position: QLCaretPosition) {
    const data = this.dialoData
    data.position = position
    removeRange()
    this.close.next(data)
    this.cdr.detectChanges()
  }

  private enterHandler(currentText: string) {
    removeRange()
    this.dialoData.position = "right"
    this.close.next(this.dialoData)

  }


  checkFocus(event: MouseEvent) {
    if (event.target === this.wrapperRef.nativeElement) {
      focus(this.textField)
    }
  }

  delete() {
    this.close.next(null)
  }

  private notify() {
    this.change.emit(this.downloadData)
  }

  private setCarretPosition(value: QLCaretPosition) {
    const tf = this.textField
    const text = tf.innerText
    const max = text.length
    let index: number = max
    if (value == "left") {
      index = 0
    }
    else if (typeof value == "number") {
      if (index > max)
        index = max
    }
    moveCaret(tf, index)
    this.carretPosition = index
  }

  private keydownHandler = (event: KeyboardEvent) => {
    const current = event.keyCode
    const text = this.textField.innerText
    if (isDirectionKey(current)) {
      const position = this.carretPosition
      if (position == 0 && isLeftKey(current)) {
        prevent(event)
        this.selectOutHandler("left")
      }
      if (position == text.length && isRightKey(current)) {
        prevent(event)
        this.selectOutHandler("right")
      }
      return
    }

    if (isReturnCode(current)) {
      prevent(event)
      this.enterHandler(text)
    }
  }

  private pasteHandler = (event: ClipboardEvent) => {
    let text = event.clipboardData.getData("text/plain")
    prevent(event)
    if (typeof text === "string") {
      this.dataLabel = paste(this.textField, text)
    }
  }
}
