import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable } from 'rxjs';
import { Thread, ThreadPart, ThreadData, ThreadTree, WatchDiff } from '../vo/vo';
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
      const id = result.id
      value.id = id
      const l = this.threadList.getValue()
      const thread = this.findThread(value.thread_id, l)
      if (thread) {
        thread.last_part = id
        this.sortThreads(l)
      }
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
      l.push(thread)
      this.threadList.next(l)
      return thread
    }))
  }

  refreshThreads(desc: boolean) {
    const l = this.threadList.getValue()
    if (l) {
      this.sortThreads(l, desc)

    }
  }

  private sortThreads(threads: Thread[] = undefined, desc: boolean = true) {
    if (!threads)
      threads = this.threadList.getValue()
    threads.sort((a: Thread, b: Thread) => {
      return a.last_part > b.last_part ? -1 : 1
    })
    if (!desc)
      threads.reverse()
    this.threadList.next(threads)
  }

  watch(diff: WatchDiff) {
    return this.http.post<WatchDiff>(
      this.getPath('watch'),
      diff
    ).pipe(map(value => {
      const threadId = value.thread
      const threadPartId = value.thread_part
      const l = this.threadList.getValue()
      const thread = this.findThread(threadId, l)
      if (!thread) {
        this.checkNewThreads()
      }
      else {
        if (thread.last_part != threadPartId) {
          thread.last_part = threadPartId
          this.sortThreads(l)
        }
      }
      return value
    }))
  }

  findThread(id: number, threads: Thread[] = undefined): Thread | undefined {
    if (!threads) {
      threads = this.threadList.getValue()
    }
    if (!threads)
      return undefined
    return threads.find(t => t.id == id)
  }


  getThreadCollection() {
    return this.http.get<Thread[]>(this.getPath("thread")).pipe(map(collection => {
      this.sortThreads(collection)
      this.threadList.next(collection)
      return collection
    }))
  }

  /*
      Send array to PHP

      const first = collection[0]
      const ids = collection.map(t=>String(t.id))
      let httpParams = ids.reduce((p, id) => p.append('ids[]', id), new HttpParams())
      httpParams = httpParams.append('contents', "0") //["contents"] = "0"
      this.http.get<Thread>(this.getPath("thread", first.id), {
        params: httpParams
      }).subscribe(result => {
        console.log(result)
      })
  */
  checkNewThreads() {
    let maxId = 0
    const l = this.threadList.getValue()
    if (!l)
      return
    for (const t of l) {
      if (maxId < t.id)
        maxId = t.id
    }
    if (maxId == 0)
      return
    this.http.get<Thread[]>(this.getPath('thread'),{
      params: {
        next: maxId.toString()
      }
    }).pipe(first()).subscribe(threads => {
      if (threads.length) {
        console.log('new threads', threads)
        l.push(...threads)
        this.sortThreads(l)
      }
    })
  }
}
