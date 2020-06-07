import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlService } from './url.service';
import { User } from '../vo/vo';
import { Subject, Observable, of, Observer } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { WatchService } from './watch.service';
import { ContextService } from '../context.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  users: User[]

  busyChange: Subject<boolean> = new Subject()
  private _busy = true
  get busy() {
    return this._busy
  }
  private _requestFlag = false
  constructor(
    private http: HttpClient,
    private url: UrlService,
    private context: ContextService,
    private watch: WatchService
  ) { }

  signout() {
    this.context.user = null
    return this.watch.stop()
  }
  getUsers() {
    if (this._busy) {
      if (!this._requestFlag) {
        this._requestFlag = true
        this.http.get<User[]>(this.url.api("user")).pipe(first()).subscribe(users => {
          this._requestFlag = true
          this.users = users
          this._busy = false
          this.busyChange.next(false)
        })
      }
      return new Observable<User[]>(obs => {
        this.busyChange.pipe(first()).subscribe(busy => {
          obs.next(this.users)
          obs.complete()
        })
      })
    }
    return of(this.users)
  }

  get user(): User {
    return this.context.user
  }

  signin() {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      this.context.user = null
      const url = this.url.api("auth")
      this.http.get<User>(url).pipe(first()).subscribe(
        user => {
          const done = (user) => {
            this.context.user = user
            this.context.users = this.users
            this.watch.run()
            observer.next(true)
          }
          if (!this.users) {
            this.getObservableUser(user.id).pipe(first()).subscribe(value => {
              done(user)
            })
            return this.getUsers()
          }
          done(this.findById(user.id))
        },
        error => {
          observer.next(false)
        })
    })
  }

  getUser(id): Observable<User> {
    if (this._busy) {
      return this.getObservableUser(id)
    }
    return of(this.findById(id))
  }

  private getObservableUser(id) {
    return new Observable<User>(obs => {
      this.busyChange.pipe(first()).subscribe(busy => {
        obs.next(this.findById(id))
        obs.complete()
      })
    })
  }

  findById(id: number): User | undefined {
    if (this._busy)
      return undefined
    return this.users.find(user => user.id == id)
  }

  updateUser(user: User) {
    return this.http.put<User>(this.url.api("user", user.id), user)
  }
  updatePicto(data: string) {
    const context = this.context
    return this.http.put<User>(this.url.api("user", context.user.id), {
      picto: data
    }).pipe(map(result => {
      context.user.picto = result.picto
      return true
    }))
  }
}
