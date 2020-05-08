import { Injectable } from '@angular/core';

import Avatars from '@dicebear/avatars';
import avataaars from '@dicebear/avatars-avataaars-sprites';
import bottts from '@dicebear/avatars-bottts-sprites';
import female from '@dicebear/avatars-female-sprites';
import gridy from '@dicebear/avatars-gridy-sprites';
import male from '@dicebear/avatars-male-sprites';
import jdenticon from '@dicebear/avatars-jdenticon-sprites';
import { Observable } from 'rxjs';

const AVATAAARS_CONFIG = {

  mouth: [
    "default",
    "disbelief",
    "eating",
    "serious",
    "smile",
    "twinkle"
  ],
  eyes: [
    "default",
    "roll",
    "happy",
    "side",
    "squint",
    "surprised"
  ]
}

const HUMAN_CONFIG = {
  mood: ['happy', 'surprised']
}

const JDENTICON_CONFIG = {
  margin: 15
}

const H16 = 16
const rdmInt = () => {
  let v = Math.round(Math.random() * H16).toString(16)
  if (v.length == 1)
    v = ` ${v}`
  return v
}
const getUID = (length = 8) => {
  let l = []
  const n = 8
  for (let i = 0; i < length; i++) {
    const v = Math.random() * n
    l.push(rdmInt())
  }
  return l.join("")
}

const getSprites = (type: AvatarType): any => {
  switch (type) {
    case "avataaars":
      return avataaars

    case "bottts":
      return bottts

    case "female":
      return female

    case "gridy":
      return gridy

    case "male":
      return male
    case "jdenticon":
      return jdenticon
  }
  return null
}

export type AvatarType = "avataaars" |
  "bottts" |
  "female" |
  "gridy" |
  "male" |
  "jdenticon"

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  private uid = Date.now()

  constructor() { }

  private avatarFactory: { [key: string]: { create: (id: string, options?: any) => string } } = {}

  private getAvatar(key: AvatarType, size: number = 200, margin: number = 10) {
    if (key in this.avatarFactory) {
      return this.avatarFactory[key]
    }

    // @TODO 
    // https://www.npmjs.com/package/@dicebear/avatars
    // Should simplify image process
    // base64 		bool 	false 	
    // Return avatar as base64 data uri instead of XML
    const conf = {
      width: size,
      height: size,
      margin: margin
    }
    this.avatarFactory[key] = new Avatars(
      getSprites(key),
      conf
    )
    return this.avatarFactory[key]
  }

  private getAvatarOptions(t: AvatarType, size: number = 200, margin: number = 10) {
    
    const options: any = {
      width: size,
      height: size,
      margin: margin
    }

    switch (t) {
      case "avataaars":
        Object.assign(options, AVATAAARS_CONFIG)
        break
      case "jdenticon":
        Object.assign(options, JDENTICON_CONFIG)
        break;
      case "male":
      case "female":
        Object.assign(options, HUMAN_CONFIG)
        break;
      default:
        break;
    }
    return options
  }

  list(type: AvatarType, length: number, size: number = 200, margin: number = 10) {
    const avatar = this.getAvatar(type, size, margin)
    const result: string[] = []
    const options = this.getAvatarOptions(type, size, margin)
    for (let i = 0; i < length; i++) {
      result.push(avatar.create(getUID(), options))
    }
    return result
  }

  encode(drawer: HTMLCanvasElement, svg: string, size: number = 200) {
    return new Observable<string>(obs => {
      drawer.width = size
      drawer.height = size
      drawer.style.width = size + "px"
      drawer.style.height = size + "px"
      const _ctx = drawer.getContext('2d')

      const img = new Image()
      const done = (error?) => {
        _ctx.clearRect(0, 0, size, size)
        if (error)
          obs.error(error)
        else
          obs.complete()
      }
      img.onload = () => {
        window.requestAnimationFrame(() => {
          _ctx.drawImage(img, 0, 0, size, size)
          URL.revokeObjectURL(img.src)
          obs.next(drawer.toDataURL("image/png"))
          done()

        })
      }
      img.onerror = done
      img.src = this.svgToObjectURL(svg)
    })
  }

  svgToObjectURL(svg: string) {
    return URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }))
  }
}
