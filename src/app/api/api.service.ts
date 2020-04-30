import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, Observer, Subscription, BehaviorSubject, of } from 'rxjs';
import { User, Thread, ThreadPart, ThreadData } from '../vo/vo';
import { map, first } from 'rxjs/operators';
import { UrlService } from './url.service';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public threadList: BehaviorSubject<Thread[]> = new BehaviorSubject([])
  private _user: User;
  get user(): User {
    return this._user
  }
  constructor(
    private http: HttpClient,
    private url: UrlService) { }

  signin() {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      this._user = null
      const url = this.getPath("auth")
      this.http.get<User>(url).pipe(first()).subscribe(
        user => {
          this._user = user
          observer.next(true)
          this.getThreadCollection().subscribe(value => {
            observer.next(true)
          })

        },
        error => {
          observer.next(false)
        })
    })
  }

  private getPath(...parts) {
    return this.url.api(...parts)
  }

  members: BehaviorSubject<User[]> = new BehaviorSubject(null)

  getMembers() {
    const members = this.members.getValue()
    if(members === null) {
      return this.http.get<User[]>(
        this.getPath("user")
      ).pipe(map(users=>{
        this.members.next(users)
        return users
      }))
    }
    else
      return of(members)
  }

  getThreadData(id) {
    return this.http.get<ThreadData>(
      this.getPath("thread", id)
    )
  }


  addThreadPart(value: ThreadPart) {

  }
  addTread(value: Thread, content: ThreadPart) {
    value.user_id = this.user.id
    return this.http.post(
      this.getPath("thread"),
      { thread: value, content: content }
    ).pipe(map((data: any) => {
      Object.assign(value, data.thread)
      Object.assign(content, data.content)

      const l = this.threadList.getValue()
      this.lastThreadUpdate = value.id
      this.lastThreadPartUpdate = content.id
      l.push(value)
      this.threadList.next(l)
    }))
  }

  private watchTimer: any = null;
  watchThreadCollection() {
    if (this.watchTimer == null)
      this.watchTimer = setInterval(this.watchThreadCollectionHandler, 3000)
  }

  private watchThreadCollectionHandler = (...args) => {
    this.getThreadUpdate().pipe(first()).subscribe()
  }

  unwatchThreadCollection() {
    if (this.watchTimer !== null) {
      clearInterval(this.watchTimer)
      this.watchTimer = null
    }
  }

  private lastThreadUpdate: number
  private lastThreadPartUpdate: number

  private getThreadUpdate() {

    return this.http.get<Thread[]>(
      this.getPath("thread"),
      {
        params: {
          "thread_id": this.lastThreadUpdate.toString()
        }
      }).pipe(map(collection => {
        if (collection.length) {
          const last = collection[collection.length - 1]
          this.lastThreadUpdate = last.id
          const l = this.threadList.getValue()
          l.push(...collection)
          this.threadList.next(l)
        }
      }))
  }

  private getThreadCollection() {
    return this.http.get<Thread[]>(this.getPath("thread")).pipe(map(collection => {
      this.threadList.next(collection)
      return collection
    }))
  }


}
