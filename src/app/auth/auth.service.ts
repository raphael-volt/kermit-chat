import { Injectable, isDevMode } from '@angular/core';
import { User } from '../vo/vo';
import { CookieService } from "ngx-cookie-service";
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { UserService } from '../api/user.service';
import { ContextService } from '../context.service';
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

  constructor(
    private userService: UserService,
    private cookieService: CookieService) {
      
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
    return this.userService.signin().pipe(
      map(success => {
        this._authorized = success
        if(success)
          this.saveCookie()
        return success
      })
    )
  }

  signin(email: string): Observable<any> {
    if (!this.jpData)
      this.jpData = {}
    this.jpData.email = email
    return this.userService.signin().pipe(
      map(success => {
        this._authorized = success
        if (success)
          this.saveCookie()
      })
    )
  }

  logout() {
    this.cookieService.delete(this.cookieKey)
    location.reload()
  }

  private saveCookie() {
    this.cookieService.set(this.cookieKey, JSON.stringify(this.jpData), 60)
  }

}
