import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Thread, ThreadPart, ThreadData, ThreadTree, WatchDiff, User } from '../vo/vo';
import { map, first, catchError, finalize } from 'rxjs/operators';
import { UrlService } from './url.service';
import { DeltaOperation } from 'quill';
import { ContextService } from '../context.service';
import { WatchNotificationService } from './watch-notification.service';
import { findImages, findDownloads } from 'mat-rte';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public threadList: BehaviorSubject<Thread[]> = new BehaviorSubject(null)
  public threadChange: EventEmitter<Thread> = new EventEmitter()
  constructor(
    private http: HttpClient,
    private url: UrlService,
    private context: ContextService,
    private notifier: WatchNotificationService) { }

  private getPath(...parts) {
    return this.url.api(...parts)
  }

  private loadThread(id: number, userId: number): Observable<ThreadData> {
    return this.http.get<ThreadData>(
      this.getPath("thread", id),
      {
        params: {
          user: userId.toString()
        }
      }
    ).pipe(map(result => {
      result.thread = this.findThread(id)
      const ops: DeltaOperation[] = result.inserts.slice()
      for (const i of result.contents) {
        ops.push(...i.inserts)
      }
      this.replaceFiles(...ops)
      this.setThreadReadBy(id)

      return result
    }))
  }
  private getThreadDataCallback = null
  getThreadData(id: number, userId: number) {
    if (this.hasThreadCollection)
      return this.loadThread(id, userId)
    return new Observable<ThreadData>(observer => {
      const sub = this.threadList.subscribe(collection => {
        if (collection) {
          sub.unsubscribe()
          this.loadThread(id, userId).pipe(first()).subscribe(data => {
            observer.next(data)
            observer.complete()
          })
        }
      })
    })
  }
  private threadReadById = 0
  private threadReadByFlag = false
  private setThreadReadBy(id, threads = null) {
    if (!threads)
      threads = this.threadList.getValue()
    if (!threads) {
      this.threadReadById = id
      this.threadReadByFlag = true
      return
    }
    const thread = this.findThread(id, threads)
    const rb = thread.read_by
    const uid = this.context.user.id//thread.user_id
    let change = false
    for (const k in rb) {
      if (!rb[k]) {
        change = true
        rb[k] = [uid]
      }
      if (rb[k].indexOf(uid) < 0) {
        rb[k].push(uid)
        change = true
      }
    }
    if (change) {
      this.threadChange.next(thread)
    }
  }

  private replaceFiles(...ops: DeltaOperation[]) {
    this.replaceDownloads(ops)
    this.replaceImages(ops)
    return ops
  }

  private replaceImages(ops: DeltaOperation[]) {
    const url = this.url
    const imgs = findImages(ops)
    for (const op of imgs) {
      op.insert.image = url.image(op.insert.image)
    }
    return ops
  }


  private replaceDownloads(ops: DeltaOperation[]) {
    const url = this.url
    const downloads = findDownloads(ops)
    for (const op of downloads) {
      op.insert.download.url = url.download(op.insert.download.file.id)
    }
    return ops
  }

  private beforeSendOperations(operations: DeltaOperation[]) {
    return new Promise<number>((resolve, reject) => {
      let bytesTotal: number = 0
      const images = findImages(operations)
      const downloads = findDownloads(operations)
      for (const img of images) {
        bytesTotal += img.insert.image.length
      }

      const quillService = this.url.quillService
      const download = quillService.download
      let sub: Subscription
      const done = () => {
        if (sub && !sub.closed)
          sub.unsubscribe()
        if (isNaN(bytesTotal))
          return reject("download file not found error")
        resolve(bytesTotal)
      }
      if (downloads.length) {

        sub = download.setFilesData(operations).subscribe(
          bytes => {
            bytesTotal += bytes
          },
          err => {
            bytesTotal = NaN
            done()
          },
          done
        )
      }
      else
        done()
    })
  }
  addTread(value: ThreadTree): Observable<Thread> {
    return new Observable<ThreadPart>(obs => {
      this.beforeSendOperations(value.inserts)
        .then(bytes => {
          this.http.post<ThreadTree>(
            this.getPath("thread"),
            value
          ).pipe(first()).subscribe(data => {
            const thread = data.thread
            const rb = {}
            rb[thread.last_part] = [value.thread.user_id]
            thread.read_by = rb
            const l = this.threadList.getValue()
            l.unshift(thread)
            value.thread = thread
            this.threadList.next(l)
            obs.next(thread)
          })
        })
    })
  }

  reply(value: ThreadPart) {
    return new Observable<ThreadPart>(obs => {
      this.beforeSendOperations(value.content as DeltaOperation[])
        .then(bytes => {
          console.log("content size", bytes)
          this.http.post<ThreadPart>(
            this.url.api("thread_part"),
            value
          ).
            pipe(first()).subscribe(
              result => {
                const id = result.id
                value.id = id
                const l = this.threadList.getValue()
                const thread = this.findThread(value.thread_id, l)
                if (thread) {
                  thread.last_part = id
                  if (!thread.read_by[id])
                    thread.read_by[id] = []
                  if (thread.read_by[id].indexOf(value.user_id) < 0)
                    thread.read_by[id].push(value.user_id)
                  this.sortThreads(l)
                  this.threadChange.next(thread)
                }
                value.content = this.replaceFiles(...result.content as DeltaOperation[])
                obs.next(value)
              },
              obs.error,
              obs.complete)
        })
        .catch(err => {
          obs.error(err)
        })
    })
  }
  addUser(value: User) {
    return this.http.post(this.url.api("user"), value)
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

  private checkActiveUsers(thread: number, previous: number[], current: number[], currentUser: number) {
    if (!previous)
      previous = []
    if (!current)
      current = []
    const newInThread: number[] = []
    const notInThread: number[] = []
    for (const uid of current) {
      if (uid == currentUser) continue
      if (previous.indexOf(uid) < 0) {
        newInThread.push(uid)
      }
    }
    for (const uid of previous) {
      if (current.indexOf(uid) < 0) {
        notInThread.push(uid)
      }
    }

    if (newInThread.length) {
      //console.log(`new in thread ${thread}: ${newInThread.join(', ')}`)
    }
    if (newInThread.length || notInThread.length) {
      //console.log(`users in thread ${thread}: ${current.join(', ')}`)
    }
    return newInThread
  }

  private checkActiveThread(diff: WatchDiff) {
    if (!diff.active_threads) return
    const context = this.context
    if (!context.user) return
    const actveThread: number = context.threadOpened
    const previous = context.activeThreads
    const current = diff.active_threads
    const currentUser = context.user.id
    const newInThread = this.checkActiveUsers(
      actveThread,
      previous[actveThread],
      current[actveThread],
      currentUser
    )
    context.activeThreads = diff.active_threads
    if (newInThread.length) {
      context.activeThreadReadChange.next(context.activeThreads[context.threadOpened])
    }
  }

  watch(diff: WatchDiff) {
    return this.http.post<WatchDiff>(
      this.getPath('watch'),
      diff
    ).pipe(map(value => {
      this.checkActiveThread(value)
      const threadId = value.thread
      const threadPartId = value.thread_part
      const l = this.threadList.getValue()
      const thread = this.findThread(threadId, l)
      if (!thread) {
        //this.notifier.message(this.context.user)
        this.checkNewThreads()
      }
      else {
        if (thread.last_part != threadPartId) {
          thread.last_part = threadPartId
          if (!thread.read_by) {
            thread.read_by = {}
          }
          if (!(threadPartId in thread.read_by))
            thread.read_by[threadPartId] = []
          this.threadChange.next(thread)
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

  private get hasThreadCollection() {
    return this.threadList.getValue() != null
  }

  getThreadCollection() {
    return this.http.get<Thread[]>(this.getPath("thread")).pipe(map(collection => {
      if (this.threadReadByFlag) {
        this.setThreadReadBy(this.threadReadById, collection)
        this.threadReadByFlag = false
      }
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
    this.http.get<Thread[]>(this.getPath('thread'), {
      params: {
        next: maxId.toString()
      }
    }).pipe(first()).subscribe(threads => {
      if (threads.length) {
        l.push(...threads)
        this.sortThreads(l)
      }
    })
  }
}
