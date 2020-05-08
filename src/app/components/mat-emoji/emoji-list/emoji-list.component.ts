import {
  Component, Input,
  Output, EventEmitter,
  ViewChildren, QueryList,
  ElementRef, ChangeDetectionStrategy,
  ChangeDetectorRef, AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Emoji, EmojiList, EmojiType } from '../core/emoji';
import { MatEmojiService } from '../mat-emoji.service';
import { MatEmojiDirective } from '../mat-emoji.directtive';
import { Subscription } from 'rxjs';


const mesureElement = (element: HTMLElement, withMargin = true): [number, number] => {
  const style = window.getComputedStyle(element)
  const width = element.offsetWidth
  const height = element.offsetHeight
  if (!withMargin)
    return [width, height]
  const marginX = parseFloat(style.marginLeft) + parseFloat(style.marginRight)
  const marginY = parseFloat(style.marginTop) + parseFloat(style.marginBottom)
  return [width + marginX , height + marginY ]
}

const isValideSize = (value: number[]): boolean => {
  for (const v of value) {
    if (isNaN(v) || v == 0)
      return false
  }
  return true
}


@Component({
  selector: 'emoji-list',
  templateUrl: './emoji-list.component.html',
  styleUrls: ['./emoji-list.component.scss'],
  host: {
    class: "emoji-list"
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmojiListComponent implements OnDestroy, AfterViewInit {

  @ViewChildren(MatEmojiDirective)
  emojiDirectiveList: QueryList<MatEmojiDirective>

  @Output()
  emojiClick: EventEmitter<Emoji> = new EventEmitter()

  @Output()
  sizeChange: EventEmitter<[number, number]> = new EventEmitter()


  @Output()
  contenSizeChange: EventEmitter<[number, number]> = new EventEmitter()

  @Input()
  listScroller: HTMLElement

  private _listContainer: HTMLElement
  @Input()
  set listContainer(value: HTMLElement) {
    if (value == this._listContainer) return
    this._listContainer = value
    if (value) {
      this.loop(false)
      this.loop(true)
    }
    else
      this.loop(false)
  }

  get listContainer(): HTMLElement {
    return this._listContainer
  }

  @Input()
  numRow = 6

  @Input()
  numColl = 8

  items: EmojiList

  private _type
  @Input()
  set emojiType(value: EmojiType) {
    if (value == this._type) return
    this._type = value
    this.items = this.factory.getEmojiList(value)
    this.cdr.detectChanges()
    this.loop(false)
    this.loop(true)
  }

  private _initFlag = false
  private loopFlag
  private _querySub: Subscription
  private _host: HTMLElement
  constructor(private factory: MatEmojiService, ref: ElementRef, private cdr: ChangeDetectorRef) {
    this._host = ref.nativeElement
  }
  ngOnDestroy(): void {
    this.loop(false)
    if (this._querySub)
      this._querySub.unsubscribe()
  }



  loop(value) {
    if (value) {
      if (!this.listContainer)
        return
      if (this.loopFlag) return
      this.loopHandler()
    }
    else {
      if (this.loopFlag) {
        window.cancelAnimationFrame(this.loopFlag)
        this.loopFlag = null
      }
    }
  }

  loopHandler = (t?) => {
    this.loopFlag = window.requestAnimationFrame(
      () => {
        if (this.canMesureViewport) {
          this.checkSize()
          const e = this.listContainer
          const ctn = mesureElement(e, false)
          const size = mesureElement(this._host, false)
          if (size[0] != ctn[0] || size[1] != ctn[1]) {
            e.style.width = `${size[0]}px`
            e.style.height = `${size[1]}px`
            e.setAttribute('width', `${size[0]}px`)
            e.setAttribute('height', `${size[1]}px`)
            this.contenSizeChange.emit(size)
          }
          this.loopFlag = null
          return
        }
        this.loopHandler()
      }
    )
  }

  ngAfterViewInit(): void {
    if (!this._initFlag) {
      this._initFlag = true
      this.emojiDirectiveList.notifyOnChanges()
      this._querySub = this.emojiDirectiveList.changes.subscribe(changes => {
        if (this.canMesureViewport) {
          this._viewInitFlag = true
          this.checkSize()
          this.loop(true)
        }
        else
          this.loop(true)
      })
    }
  }

  private _viewInitFlag = false;

  private size: [number, number] = [0, 0]

  private get maxIconSize(): [number, number] {
    const size: [number, number] = [0, 0]
    for (const ed of this.emojiDirectiveList.toArray()) {
      const s = mesureElement(ed.host)
      for(const i of [0,1]) {
        if (s[i] > size[i])
          size[i] = s[i]
      }
    }
    return size
  }
  private checkSize() {
    if (!this._viewInitFlag)
      return
    let e: HTMLElement
    const numColl = this.numColl
    const numRow = this.numRow
    let size = this.maxIconSize
    let change = false

    const _width = Math.ceil(size[0] * numColl);
    const _height = size[1] * numRow;

    if (size[0] != this.size[0]) {
      e = this._host
      change = true
      this.size[0] = size[0]
      e.style.width = _width + "px"
    }
    let _currentSize = this.size
    if (size[1] != _currentSize[1]) {
      change = true
      _currentSize[1] = size[1]
    }
    if (change) {
      e = this.listScroller
      if (e) {
        e.style.height = `${_height}px`
      }
      this.sizeChange.emit([_width, _height])
    }

  }

  private get canMesureViewport(): boolean {
    const l = this.emojiDirectiveList
    if (!l || l.length == 0)
      return false
    return isValideSize(mesureElement(l.first.host))
  }
}
