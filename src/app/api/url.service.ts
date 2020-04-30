import { Injectable } from '@angular/core';
import { ApiConfig } from './api-config';

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

  constructor(private _config: ApiConfig) { }

  path(...parts: PathParts) {
    return [this._config.url, ...parts].join("/")
  }

  api(...parts: PathParts) {
    return this.path(this._config.routes.api, ...parts)
  }
  image(id: string|number) {
    return this.path(this._config.routes.images+ `?id=${id}`)
  }
  
  download(...parts: PathParts) {
    return this.path(this._config.routes.downloads, ...parts)
  }

}
