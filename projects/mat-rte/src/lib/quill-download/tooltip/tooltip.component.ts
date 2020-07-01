import {
  Component, Input, EventEmitter,
  ViewChild, ElementRef, AfterViewInit,
  Output, Inject, OnDestroy
} from '@angular/core';
import { DownloadData, QLCaretPosition, DownloadTooltipData } from '../../quill';
import { DownloadService } from '../download.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { removeRange, isDirectionKey, getCarretPosition, isLeftKey, prevent, isRightKey, isReturnCode, paste, moveCaret } from './content-editor.utils';

@Component({
  selector: 'ql-download-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class QLDownloadTooltip implements AfterViewInit, OnDestroy {

  @Output()
  change: EventEmitter<DownloadData> = new EventEmitter()
  @Output()
  close: EventEmitter<DownloadData> = new EventEmitter()
  @Output()
  selectOut: EventEmitter<QLCaretPosition> = new EventEmitter<QLCaretPosition>()

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
  
  private get fileMapId() {
    return this.dialoData.mapId
  }
  private get downloadData() {
    return this.dialoData.data
  }
  private set dataLabel(value: string) {
    this.downloadData.label = value
    this.notify()
  }

  viewInitialized = false
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialoData: DownloadTooltipData,
    private dialoRef: MatDialogRef<QLDownloadTooltip>,
    private download: DownloadService) {
    this.initLabel()
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

  triggerClick(event: MouseEvent) {
    this.inputRef.nativeElement.click()
    event.stopPropagation()
    event.preventDefault()
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.viewInitialized = true
    })
    const tf = this.textField
    tf.innerText = this.downloadData.label
    tf.addEventListener('keydown', this.keydownHandler)
    tf.addEventListener('paste', this.pasteHandler)
    this.setCarretPosition(this.dialoData.position)
    tf.dataset.placeholder = this.placeholder
  }
  ngOnDestroy(): void {
    const tf = this.textField
    tf.removeEventListener('keydown', this.keydownHandler)
    tf.removeEventListener('paste', this.pasteHandler)
  }
  inputHandler(event?: InputEvent) {
    if (event)
      event.stopImmediatePropagation()
    this.dataLabel = this.textField.innerText
  }

  private selectOutHandler(position: QLCaretPosition) {
    const data = this.dialoData
    data.position = position
    removeRange()
    this.dialoRef.close(data)
  }

  private enterHandler(currentText: string) {
    removeRange()
    this.dialoData.position = "right"
    this.dialoRef.close(this.dialoData)

  }


  checkFocus(event: MouseEvent) {
    if (event.target === this.wrapperRef.nativeElement) {
      this.textField.focus()
    }
  }

  fileChange(event: Event) {
    const i = event.target as HTMLInputElement
    const file = i.files[0]
    this.dialoData.data.file = {
      name: file.name,
      id: this.download.registerFile(file, this.fileMapId),
      size: file.size,
      mime: file.type,
      ext: file.name.split(".").pop()
    }
    this.notify()
  }

  delete() {
    this.dialoRef.close(null)
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
  }

  private keydownHandler = (event: KeyboardEvent) => {
    const current = event.keyCode
    const text = this.textField.innerText
    if (isDirectionKey(current)) {
      const position = getCarretPosition()
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
