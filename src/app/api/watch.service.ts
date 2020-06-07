import { Injectable, EventEmitter } from '@angular/core';
import { ApiService } from './api.service';
import { first } from 'rxjs/operators';
import { WatchDiff, User, WatchStatus } from '../vo/vo';
import { WatchNotificationService } from './watch-notification.service';
import { Subscription } from 'rxjs';
import { ContextService } from '../context.service';


@Injectable({
  providedIn: 'root'
})
export class WatchService {


  private timer = null

  private diff: WatchDiff = {
    user_id: 0,
    status: "on",
    thread_user: 0,
    thread: 0,
    thread_part: 0,
    users: []
  }

  findById(id: number): User | undefined {
    return this.members.find(user => user.id == id)
  }

  constructor(
    private api: ApiService,
    private context: ContextService,
    private notifier: WatchNotificationService) { }

  private get currentUser() {
    return this.context.user
  }
  private get members(): User[] {
    return this.context.users
  }
  run() {
    if (this.timer === null) {
      this.notifier.open(`Bonjour ${this.currentUser.name}`)
      const threadList = this.api.threadList
      if (threadList.getValue())
        return this.initWatch()
      const s: Subscription = threadList.subscribe(value => {
        if (value) {
          s.unsubscribe()
          this.initWatch()
        }
      })
    }
  }
  stop() {
    return new Promise<void>((res, rej) => {
      if (this.timer !== null) {
        this.firstUserCheck = false
        clearTimeout(this.timer)
        this.timer = null
        const diff = this.diff
        diff.status = "off"
        diff.users = []
        this.api.watch(diff).pipe(first()).subscribe(result => {
          res()
        })
      }
      else
        rej("not watching")
    })
  }

  private firstUserCheck = false

  private initWatch() {
    const diff: WatchDiff = this.diff
    const currentUser = this.currentUser.id
    diff.user_id = currentUser
    diff.status = 'on'
    diff.thread_opened = this.context.threadOpened
    this.api.watch(diff).pipe(first()).subscribe(result => {
      diff.thread_user = result.thread_user
      diff.thread = result.thread
      diff.thread_part = result.thread_part
      diff.status = ""
      if (!this.checkUsersDiff(result.users))
        this.$users.emit(diff.users)
      this.timerHandler()
    })
  }
  private checkUsersDiff(users: number[]) {
    let _findId: number
    const findUser = id => id == _findId
    const _members = this.members
    let change = false
    const current = this.currentUser.id

    const newOn = []
    const newOff = []
    for (const m of _members) {

      _findId = m.id
      const _on = users.find(findUser)
      const ns: WatchStatus = _on ? "on" : "off"
      const cs: WatchStatus = m.status == "on" ? "on" : "off"
      if (ns != cs) {
        change = true
        m.status = ns
        if (current != m.id) {
          switch (ns) {
            case "on":
              newOn.push(m)
              break;
            case "off":
              newOff.push(m)
              break;

            default:
              break;
          }
        }
      }
      if (change) {

      }
    }
    if (!this.firstUserCheck) {
      if (newOn.length) {
        this.notifier.usersOn(newOn)
      }
      this.firstUserCheck = true
      return true
    }
    if (newOn.length || newOff.length) {
      this.notifier.usersOn([...newOn, ...newOff])

    }
    return change
  }

  private timerHandler = () => {
    this.timer = setTimeout(() => {

      const diff: WatchDiff = this.diff
      diff.thread_opened = this.context.threadOpened
      this.api.watch(diff).pipe(first()).subscribe(result => {
        const notifier = this.notifier
        const current_user = this.currentUser.id
        const newThreadPartId = result.thread_part
        const thread_user = result.thread_user
        const newThreadId = result.thread
        let threadChange = false
        let threadPartChange = false
        if (diff.thread != newThreadId) {
          diff.thread = newThreadId
          threadChange = true
        }
        if (diff.thread_part != newThreadPartId) {
          diff.thread_part = newThreadPartId
          threadPartChange = true
        }
        if (diff.thread_user != thread_user) {
          diff.thread_user = thread_user
        }
        if (threadChange) {
          if (thread_user != current_user)
            notifier.message(this.findById(thread_user))
          this.$thread.emit(diff.thread)
        }
        else {
          if (threadPartChange) {
            if (thread_user != current_user)
              notifier.reply(this.findById(thread_user))
            this.$threadPart.emit(newThreadPartId)
          }
        }

        /*
        if (threadPartChange) {
          if (thread_user != current_user)
            notifier.reply(this.findById(thread_user))
          this.$threadPart.emit(newThreadPartId)
        }
        */
        if (!this.checkUsersDiff(result.users))
          this.$users.emit(diff.users)

        this.timerHandler()
      })
    }, 3000)
  }
  get thread() {
    return this.diff.thread
  }

  get threadPart() {
    return this.diff.thread_part
  }

  users: number[] = []
  $thread: EventEmitter<number> = new EventEmitter()
  $threadPart: EventEmitter<number> = new EventEmitter()
  $users: EventEmitter<number[]> = new EventEmitter()
}
