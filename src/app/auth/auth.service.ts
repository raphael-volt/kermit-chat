import { Injectable, isDevMode } from '@angular/core';
import { User } from '../vo/vo';
import { CookieService } from "ngx-cookie-service";
import { map, first } from "rxjs/operators";
import { Observable } from 'rxjs';
import { UserService } from '../api/user.service';
import { ContextService } from '../context.service';
import { ApiService } from '../api/api.service';
import { WatchService } from '../api/watch.service';
interface JPData {
  email?: string
  threadRequest?: number
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiKey = "22317bca3371399e"

  private readonly cookieKey = "jp-data"

  private jpData: JPData
  private _authorized: boolean = false

  get authorized() {
    return this._authorized
  }
  public get email(): string {
    if (this.jpData && "email" in this.jpData)
      return this.jpData.email
    return null
  }

  private _path: string
  private _domain: string
  private _secure: boolean
  private _sameSite: "Lax" | "None" | "Strict"
  
  constructor(
    private userService: UserService,
    private cookieService: CookieService,
    private api: ApiService,
    private watch: WatchService,
    private context: ContextService) {

      const isDev = isDevMode()
      this._domain = isDev ? "":"jp.ketmie.com"
      this._path = isDev ? "/":"/"
      this._secure = ! isDev
      this._sameSite = isDev ? "Lax":"Strict"
  }



  getAuthData(): string {
    return btoa(`${this.jpData.email}:${this.apiKey}`)
  }

  hasCookie() {
    return this.cookieService.check(this.cookieKey)
  }

  loadCookie() {
    if (!this.hasCookie)
      this.jpData = {}
    else {
      const data = this.cookieService.get(this.cookieKey)
      try {
        this.jpData = JSON.parse(data)
      } catch (error) {
        this.cookieService.delete(this.cookieKey)
        this.jpData = null
        this._authorized = false
      }
    }
  }

  saveUser(user: User) {
    this.jpData.email = user.email
    this.saveCookie()
  }

  saveThreadRequest(id: number) {
    this.jpData.threadRequest = id
    this.saveCookie()
  }

  init(): Observable<boolean> {
    return this.signinObservable()
  }

  private signinObservable() {
    return new Observable<boolean>(observer => {
      if (!this.jpData)
        return observer.error("missing auth cookie")
      const context = this.context
      context.user = null
      this.userService.signin().pipe(first()).subscribe(user => {
        if (!user) {
          observer.next(false)
          return observer.complete()
        }
        this.saveCookie()
        this.userService.getUsers().pipe(first()).subscribe(users => {
          context.users = users
          context.user = context.findUser(user.id)
          this.api.getThreadCollection().pipe(first()).subscribe(collection=>{
            this.watch.run()
            this._authorized = true
            observer.next(true)
            observer.complete()
          })
        })
      })
    })
  }

  signin(email: string): Observable<boolean> {
    if (!this.jpData)
      this.jpData = {}
    this.jpData.email = email
    return this.signinObservable()
  }

  private deleteCookie() {
    
    this.cookieService.delete(this.cookieKey, this._path, this._domain, this._secure, this._sameSite)

  }
  logout() {
    this.deleteCookie()
    location.reload()
  }

  private saveCookie() {
    this.cookieService.set(this.cookieKey, JSON.stringify(this.jpData), 60, this._path, this._domain, this._secure, this._sameSite)
  }

}
