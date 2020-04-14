import { Injectable } from '@angular/core';
import { User } from '../vo/vo';
import { CookieService } from "ngx-cookie-service";
import { ApiService } from '../api/api.service';
import { map } from "rxjs/operators";
import { Observable, of } from 'rxjs';
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
    private apiService: ApiService,
    private cookieService: CookieService) { }



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
  ;
  saveUser(user: User) {
    this.jpData.email = user.email
    this.saveCookie()
  }

  saveThreadRequest(id: number) {
    this.jpData.threadRequest = id
    this.saveCookie()
  }

  init(): Observable<boolean> {
    return this.apiService.signin().pipe(
      map(success => {
        this._authorized = success
        if(success)
          console.log(`Hello ${this.apiService.user.name}`)
        return success
      })
    )
  }

  signin(email: string): Observable<any> {
    if (!this.jpData)
      this.jpData = {}
    this.jpData.email = email
    return this.apiService.signin().pipe(
      map(success => {
          this._authorized = success
        if(success)
          this.saveCookie()
        console.log(`Welcome ${this.apiService.user.name}`)
      })
    )
  }

  private saveCookie() {
    let data = JSON.stringify(this.jpData);
    this.cookieService.set(this.cookieKey, data)
    data = this.cookieService.get(this.cookieKey)
  }

}
