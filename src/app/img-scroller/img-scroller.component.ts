import { Component, Input, ViewChild, ElementRef, EventEmitter, Output, HostListener, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { VPScroller } from './geom/vpscroller';
import { Observable } from 'rxjs';
import { Matrix, Number2, isFixedArray } from './geom/matrix';
import { VPPoint, getVPPoint } from './geom/vppoint';

const is_touch_device = () => {
  return !!('ontouchstart' in window        // works on most browsers 
    || navigator.maxTouchPoints);       // works on IE10/11 and Surface
}

const IS_TOUCH_DEVICE: boolean = is_touch_device()

const getEventType = (type: "down" | "move" | "up"): string => {
  if (IS_TOUCH_DEVICE) {
    switch (type) {
      case "down":
        return "touchstart"
      case "move":
        return "touchmove"
      case "up":
        return "touchend"
    }
  }
  switch (type) {
    case "down":
      return "mousedown"

    case "move":
      return "mousemove"

    case "up":
      return "mouseup"
  }
}

const getEventPoint = (key: "screen" | "offset" | "client", event: any): VPPoint => {
  const p: VPPoint = getVPPoint(0,0)
  if (IS_TOUCH_DEVICE) {
    const touch = event.touches[0]
    switch (key) {
      case "screen":
        p.x = touch.screenX
        p.y = touch.screenY
        break;
      case "client":
      case "offset":
        p.x = touch.clientX
        p.y = touch.clientY
        break;

      default:
        break;
    }
    return p
  }
  switch (key) {
    case "screen":
      p.x = event.screenX
      p.y = event.screenY
      break;
    case "client":
      p.x = event.clientX
      p.y = event.clientY
      break;
    case "offset":
      p.x = event.offsetX
      p.y = event.offsetY
      break;
    default:
      break;
  }
  return p
}
const getDelta = (event: any): number => {
  if (!event)
    return 0
  let delta: number = 0
  if ("deltaY" in event) {
    delta = event.deltaY
  }
  else {
    if ("wheelDeltaY" in event) {
      delta = event.wheelDeltaY
    }
  }
  return delta
}

export type ImgScrollerEvent = {
  target?: HTMLImageElement
  matrix?: Matrix
  viewport?: Number2
}


@Component({
  selector: 'div[img-scroller]',
  templateUrl: './img-scroller.component.html',
  styleUrls: ['./img-scroller.component.scss'],
  host: {
    'class': 'img-scroller',
    '[attr.width]': 'viewport[0]',
    '[attr.height]': 'viewport[1]',
    '[style.height]': 'viewport[0]+"px"',
    '[style.width]': 'viewport[1]+"px"'
  },
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class ImgScrollerComponent implements OnDestroy {

  src: string
  @Input()
  set imgSource(value: string | File) {
    if (value instanceof File) {
      let fr: FileReader = new FileReader()
      const done = () => {
        fr.removeEventListener("loadend", done)
        this.src = fr.result as any
        fr = null
      }
      fr.addEventListener("loadend", done)
      fr.readAsDataURL(value)
    }
    else {
      this.src = value
    }
  }

  private _viewport: Number2 = [200, 200]
  @Input()
  set viewport(value: Number2) {
    const def: Number2 = [200, 200]
    if(! value)
      value = def
    if (!isFixedArray(value, 2)) {
      const n = value.length
      if (!n) {
        value = def
      }
      else if (n < 2)
        value[1] = def[1]
    }
    this._viewport = value
  }

  get viewport(): Number2 {
    return this._viewport
  }
  @Output()
  transformChange: EventEmitter<ImgScrollerEvent> = new EventEmitter()

  @Output()
  load: EventEmitter<HTMLImageElement> = new EventEmitter()

  @HostListener("wheel", ['$event'])
  wheelHandler = (event: MouseEvent) => {
    event.stopImmediatePropagation()
    event.preventDefault()

    const scroller = this._scroller
    const d = getDelta(event)

    const inc = .01 * Math.abs(d)
    let mult = 1 - (d > 0 ? inc : -inc)
    let s = mult
    const cs = this.actualScale
    const sizes = this.imgSizes
    const newS = cs * mult
    const minS = scroller.getMinScale("min", sizes[0], sizes[1])
    if (newS < minS) {
      s = minS / cs
    }
    scroller.scaleAt(event.offsetX, event.offsetY, s)
    this.updateTransform()

  }

  private dragData: {
    x: number
    y: number
    sx: number
    sy: number
  }

  startDrag = (event: MouseEvent) => {
    const p = getEventPoint("screen", event)
    this.dragData = {
      x: p.x,
      y: p.y,
      sx: this._scroller.scrollX,
      sy: this._scroller.scrollY,
    }
    window.addEventListener(getEventType("move"), this.doDrag)
    window.addEventListener(getEventType("up"), this.stopDrag)
  }

  doDrag = (event: MouseEvent) => {
    const p = getEventPoint("screen", event)
    const dd = this.dragData
    const dx = dd.x - p.x
    const dy = dd.y - p.y
    this._scroller.scroll(dd.sx + dx, dd.sy + dy)
    this.updateTransform()
  }

  stopDrag = (event: MouseEvent) => {
    window.removeEventListener(getEventType("move"), this.doDrag)
    window.removeEventListener(getEventType("up"), this.stopDrag)
  }

  @ViewChild('cnv')
  cnvRef: ElementRef<HTMLCanvasElement>

  imgTransform: string

  private _scroller: VPScroller
  private _host: HTMLDivElement
  private imgSizes: Number2

  private _img: HTMLImageElement
  private get actualScale() {
    return this.actualWidh / this.imgSizes[0]
  }

  private get actualWidh() {
    return this._scroller.content.width
  }

  constructor(ref: ElementRef<HTMLDivElement>, private cdr: ChangeDetectorRef) {
    this._host = ref.nativeElement
    this._host.addEventListener(getEventType("down"), this.startDrag)
  }

  ngOnDestroy() {
    this._host.removeEventListener(getEventType("down"), this.startDrag)
  }


  imgLoaded(event: Event) {
    const img: HTMLImageElement = event.currentTarget as HTMLImageElement
    this._img = img
    const vp = this._viewport
    const sizes: Number2 = [img.naturalWidth, img.naturalHeight]
    this.imgSizes = sizes
    this._scroller = new VPScroller(vp[0], vp[1], sizes[0], sizes[1])
    this._scroller.fitMin()
    this.updateTransform()
  }

  private get actualMatrix(): Matrix {
    const ct = this._scroller.content
    const s = this.actualScale
    return new Matrix([s, s, ct.x, ct.y])
  }
  
  private updateTransform() {
    const m = this.actualMatrix
    this.imgTransform = m.toString()
    this.cdr.detectChanges()
    this.transformChange.emit({
      matrix: m,
      target: this._img,
      viewport: this._viewport
    })
  }

  drawViewport(type: string = "image/jpeg", quality?, matrix: Matrix = null): Observable<string> {
    return new Observable<string>(obs => {
      if (!this._img)
        return obs.error('Missing image')

      const vp = this.viewport
      const cnv = this.cnvRef.nativeElement
      const ctx = cnv.getContext('2d')
      ctx.clearRect(0, 0, vp[0], vp[1])
      
      if (!matrix)
        matrix = this.actualMatrix
      
      matrix.invert()
      const _tl = matrix.transform([0,0])
      const _br = matrix.transform(vp.slice() as Number2)
      
      window.requestAnimationFrame(() => {
        ctx.drawImage(
          this._img,
          _tl[0], _tl[1], _br[0] - _tl[0], _br[1] - _tl[1],
          0, 0, vp[0], vp[1])
        obs.next(cnv.toDataURL(type, quality))
        obs.complete()
      })
    })
  }
}
