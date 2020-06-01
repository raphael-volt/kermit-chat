
import { Component, AfterViewInit, QueryList, ElementRef, ViewChildren, ViewChild, Output, EventEmitter } from '@angular/core'
import { ListSliderDirective, SlideDirection } from './list-slider.directive'
import { EmojiListComponent } from '../emoji-list/emoji-list.component'
import { EmojiCategory, Emoji } from '../core/emoji'
import { MatEmojiService } from '../mat-emoji.service'


@Component({
  selector: 'emoji-select',
  templateUrl: './emoji-select.component.html',
  styleUrls: ['./emoji-select.component.scss'],
  host: {
    'class': 'mat-elevation-z2'
  }
})
export class EmojiSelectComponent implements AfterViewInit {

  @Output()
  emojiClick: EventEmitter<Emoji> = new EventEmitter()
  
  @Output()
  viewInit: EventEmitter<DOMRect> = new EventEmitter()

  selectedIndex = 0
  selectedCategory
  categories: EmojiCategory[]

  @ViewChildren(ListSliderDirective) sliderQuery: QueryList<ListSliderDirective>
  @ViewChildren(EmojiListComponent) listQuery: QueryList<EmojiListComponent>

  @ViewChild('wrapper')
  listWrapper: ElementRef<HTMLElement>

  private slider: SliderHelper

  constructor(private emojiService: MatEmojiService, private ref: ElementRef<HTMLElement>) {
    this.categories = emojiService.getCategories()
    this.selectedCategory = this.categories[emojiService.selectedIndex]
    this.selectedIndex = emojiService.selectedIndex
  }

  private get bounds() {
    return this.ref.nativeElement.getBoundingClientRect()
  }
  ngAfterViewInit(): void {
    this.slider = new SliderHelper(this.listQuery, this.sliderQuery, this.listWrapper.nativeElement)
    this.slider.left(this.selectedCategory)
    this.viewInit.emit(this.bounds)
  }

  setCategory(c: EmojiCategory) {
    if (this.selectedCategory == c) return
    this.selectedCategory = c
    const l = this.categories
    const _newIndex = l.indexOf(c)
    const _currentIndex = this.selectedIndex
    this.selectedIndex = _newIndex
    this.emojiService.selectedIndex = _newIndex
    if (_newIndex > _currentIndex)
      this.slider.right(c)
    else
      this.slider.left(c)
  }
}

class SliderHelper {

  private _current: SliderProxy
  private _proxyList: SliderProxy[]
  constructor(
    listQuery: QueryList<EmojiListComponent>,
    sliderQuery: QueryList<ListSliderDirective>,
    public contentElement: HTMLElement
  ) {
    this._proxyList = [
      new SliderProxy(sliderQuery.first, listQuery.first),
      new SliderProxy(sliderQuery.last, listQuery.last)
    ]
  }

  left(category: EmojiCategory) {
    this.move('left', category)
  }
  right(category: EmojiCategory) {
    this.move('right', category)
  }

  private move(dir: SlideDirection, category: EmojiCategory) {
    const hideDir: SlideDirection = dir == "left" ? "right" : "left"
    let _current = this._current
    if (_current) {
      _current.list.listContainer = null
      _current.slider.hide(hideDir)
    }
    _current = this.getNext()
    this._current = _current
    _current.slider.show(dir)
    _current.list.listContainer = this.contentElement
    _current.setData(category)
  }

  getNext(): SliderProxy {
    const _current = this._current
    const _list = this._proxyList
    if (!_current) return _list[0]
    if (_current == _list[0])
      return _list[1]
    return _list[0]
  }
}

class SliderProxy {
  constructor(
    public slider: ListSliderDirective,
    public list: EmojiListComponent
  ) { }
  setData(value: EmojiCategory) {
    this.list.emojiType = value.type
  }
}