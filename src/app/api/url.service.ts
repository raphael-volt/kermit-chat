import { Injectable } from '@angular/core';
import { ApiConfig } from './api-config';
import { QuillService } from 'mat-rte';

export type PathPart = string|number
export type PathParts = PathPart[]

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  set config(value: ApiConfig) {
    this._config = value;
  }
  
  get config(): ApiConfig {
    return this._config
  }

  constructor(
    private _config: ApiConfig,
    public quillService: QuillService) { 
      quillService.downloadUrlFn = id => this.download(id)
    }

  path(...parts: PathParts) {
    return [this._config.url, ...parts].join("/")
  }

  api(...parts: PathParts) {
    return this.path(this._config.routes.api, ...parts)
  }
  image(id: string|number) {
    return this.path(this._config.routes.images+ `?id=${id}`)
  }
  
  download(id: string|number) {
    return this.path(this._config.routes.downloads+ `?id=${id}`)
  }

}
