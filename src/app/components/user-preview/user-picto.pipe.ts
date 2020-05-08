import { Pipe, PipeTransform } from '@angular/core';
import { UrlService } from 'src/app/api/url.service';
import { isUser } from 'src/app/vo/vo';

@Pipe({
  name: 'userPicto'
})
export class UserPictoPipe implements PipeTransform {

  constructor(private url: UrlService) {

  }
  transform(value: any, ...args: unknown[]): string {
    let picto = NaN
    if (value) {
      if(typeof value == "object" && 'picto' in value) {
        picto = value.picto
      }
      else {
        if (typeof value == "string") {
          picto = parseInt(value)
        }
        else if (typeof value == "number") {
          picto = value
        }
      }
    }
    console.log(`userPicto => ${picto} | ${value}`)
    if (!isNaN(picto))
      return this.url.image(picto)
    return "";
  }

}
