import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, Observer, Subscription } from 'rxjs';
import { User } from '../vo/vo';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly apiUrl = "http://localhost:4201/api"

  private _user: User;
  get user(): User {
    return this._user
  }
  constructor(
    private http: HttpClient) { }

  signin() {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      let clearFlag = false
      let sub: Subscription
      const clear = () => {
        clearFlag = true
        if (sub && !sub.closed)
          sub.unsubscribe()
      }
      sub = this.http.get<User>(this.getPath("auth")).subscribe(
        user => {
          this._user = user
          clear()
          observer.next(true)
        },
        error => {
          clear()
          observer.next(false)
        })
      if (clearFlag && !sub.closed)
        sub.unsubscribe()
    })
  }

  private getPath(...parts) {
    return [this.apiUrl, ...parts].join("/")
  }


  getMembers() {
    return this.http.get<User[]>(
      this.getPath("user")
    )
  }
}
