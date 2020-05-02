import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs';
import { Thread, ThreadPart, ThreadData } from '../vo/vo';
import { map, first } from 'rxjs/operators';
import { UrlService } from './url.service';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public threadList: BehaviorSubject<Thread[]> = new BehaviorSubject(null)

  constructor(
    private http: HttpClient,
    private url: UrlService) { }

  private getPath(...parts) {
    return this.url.api(...parts)
  }

  getThreadData(id) {
    return this.http.get<ThreadData>(
      this.getPath("thread", id)
    )
  }


  addThreadPart(value: ThreadPart) {

  }
  addTread(value: Thread, content: ThreadPart) {
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

  getThreadCollection() {
    return this.http.get<Thread[]>(this.getPath("thread")).pipe(map(collection => {
      this.threadList.next(collection)
      return collection
    }))
  }


}
