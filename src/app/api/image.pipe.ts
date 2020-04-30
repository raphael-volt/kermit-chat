import { Pipe, PipeTransform } from '@angular/core';
import { UrlService } from './url.service';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  constructor(private url: UrlService) {

  }
  transform(value: unknown, ...args: unknown[]): unknown {
    let id: string | number = NaN
    if(typeof value == "object") {
      if('picto' in value) {
        id = value['picto']
      }
      else if('id' in value)
        id = value['id']
    }
    else {
      if(typeof value == "string" || typeof value == "number") {
        id = value
      }
    }
    if(! isNaN(+id)) {
      return this.url.image(id)
    }
    return null;
  }

}
