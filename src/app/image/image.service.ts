import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type IMG_TYPE = "png" | "jpeg" | "jpg" | "gif" | "svg+xml"

const IMAGE: string = "image"
const PATH_SEPARATOR: string = "/"
const join = (...parts: string[]) => {
  return parts.join(PATH_SEPARATOR)
}
type ImgTypeMap = { [key: string]: string }
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private _canvas: HTMLCanvasElement
  private _ctx: CanvasRenderingContext2D
  private _canvasAdded: boolean = false

  private typeMap: ImgTypeMap = {}
  constructor() { }

  getType(type: IMG_TYPE) {
    const map = this.typeMap
    if (!map[type])
      map[type] = join(IMAGE, type)
    return map[type]
  }
  get typePng() {
    return this.getType("png")
  }

  get typeJpg() {
    return this.getType("jpg")
  }

  get typeJpeg() {
    return this.getType("jpeg")
  }
  get typeGif() {
    return this.getType("gif")
  }

  get typeSvgXml() {
    return this.getType("svg+xml")
  }

  private get canvas() {
    let canvas = this._canvas
    if (!canvas) {
      canvas = document.createElement("canvas")
      canvas.style.opacity = "0";
      this._ctx = canvas.getContext('2d')
      this._canvas = canvas
    }
    if (!this._canvasAdded) {
      document.body.appendChild(canvas)
      this._canvasAdded = true
    }
    return canvas
  }

  private setUpCanvas(width: number, height: number) {
    const canvas = this.canvas
    canvas.width = width
    canvas.height = height
    return canvas
  }

  private clearCanvas(remove: boolean = true) {
    const canvas = this.canvas
    this._ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (remove && this._canvasAdded) {
      document.body.removeChild(canvas)
      this._canvasAdded = false
    }
  }

  private requestDraw(callback: () => void) {
    window.requestAnimationFrame(callback)
  }

  svg2png(svg: string, destWidth: number, destHeight: number) {
    return new Observable<string>(obs => {
      const canvas = this.setUpCanvas(destWidth, destHeight)
      const img = new Image()
      const done = (error?) => {
        this.clearCanvas()
        if (error)
          obs.error(error)
        else
          obs.complete()
      }
      img.onload = () => {
        this.requestDraw(() => {
          this._ctx.drawImage(img, 0, 0, destWidth, destHeight)
          URL.revokeObjectURL(img.src)
          obs.next(canvas.toDataURL(this.typePng))
          done()
        })
      }
      img.onerror = done
      img.src = this.svgToObjectURL(svg)
    })
  }

  svgToObjectURL(svg: string) {
    return URL.createObjectURL(new Blob([svg], { type: this.typeSvgXml }))
  }

  crop(src: HTMLImageElement, destType: string,
    x: number, y: number, width: number, height: number,
    destWidth: number = NaN, destHeight: number = NaN): Observable<string> {
    return new Observable<string>(obs => {
      this.requestDraw(() => {
        if (isNaN(destWidth))
          destWidth = width
        if (isNaN(destHeight))
          destHeight = height
        const cnv = this.setUpCanvas(width, height)
        const ctx = this._ctx
        ctx.drawImage(src,
          x, y, width, height,
          0, 0, destWidth, destHeight)
        obs.next(cnv.toDataURL(destType))
        this.clearCanvas()
        obs.complete()
      })
    })
  }

  fileToImg(file: File) {
    return URL.createObjectURL(file);
  }
}
