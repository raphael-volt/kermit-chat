import { Injectable } from '@angular/core';

import Avatars from '@dicebear/avatars';
import avataaars from '@dicebear/avatars-avataaars-sprites';
import bottts from '@dicebear/avatars-bottts-sprites';
import female from '@dicebear/avatars-female-sprites';
import gridy from '@dicebear/avatars-gridy-sprites';
import male from '@dicebear/avatars-male-sprites';

import { Observable } from 'rxjs';
import { ImageService } from '../image/image.service';

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
  }
  return null
}
export type AvatarType = string | "avataaars" |
  "bottts" |
  "female" |
  "gridy" |
  "male"

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  private uid = Date.now()

  constructor(private imgService: ImageService) { }

  private avatarFactory: { [key: string]: { create: (id: string) => string } } = {}

  private getAvatar(key: AvatarType, size: number = 200, margin: number = 10) {
    if (key in this.avatarFactory) {
      // cannot set config ...
      return this.avatarFactory[key]
    }

    this.avatarFactory[key] = new Avatars(getSprites(key), {
      width: size,
      height: size,
      margin: margin
    })
    return this.avatarFactory[key]
  }

  list(type: AvatarType, length: number, size: number = 200, margin: number = 10) {
    const avatar = this.getAvatar(type, size, margin)
    const result: string[] = []
    for (let i = 0; i < length; i++) {
      result.push(avatar.create(String(this.uid++)))
    }
    return result
  }

  encode(svg: string, size: number = 200) {
    return this.imgService.svg2png(svg, size, size)
  }
}
