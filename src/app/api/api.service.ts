import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from 'rxjs';
import { Thread, ThreadPart, ThreadData, ThreadTree } from '../vo/vo';
import { map, first } from 'rxjs/operators';
import { UrlService } from './url.service';
import { DeltaOperation } from 'quill';
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
    ).pipe(map(result => {
      const ops: DeltaOperation[] = result.inserts.slice()
      for (const i of result.contents) {
        ops.push(...i.inserts)
      }
      this.replaceImage(...ops)
      
      return result
    }))
  }

  private replaceImage(...ops: DeltaOperation[]) {
    const url = this.url
    for (const op of ops) {
      if (typeof op.insert == "object" && "image" in op.insert) {
        op.insert.image = url.image(op.insert.image)
      }
    }
    return ops
  }

  reply(value: ThreadPart) {
    return this.http.post<ThreadPart>(
      this.url.api("thread_part"),
      value
    ).pipe(map(result => {
      value.id = result.id
      value.content = this.replaceImage(...result.content as DeltaOperation[])
      return value
    }))
  }
  addTread(value: ThreadTree): Observable<Thread> {
    return this.http.post<ThreadTree>(
      this.getPath("thread"),
      value
    ).pipe(map((data: any) => {
      const thread = data.thread

      const l = this.threadList.getValue()
      this.lastThreadUpdate = thread.id
      l.push(thread)
      this.threadList.next(l)
      return thread
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
