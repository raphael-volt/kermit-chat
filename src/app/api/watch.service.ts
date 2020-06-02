import { Injectable, EventEmitter } from '@angular/core';
import { ApiService } from './api.service';
import { first } from 'rxjs/operators';
import { WatchDiff, UserStatus, User, WatchStatus } from '../vo/vo';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WatchService {


  private timer = null

  private dif: WatchDiff = {
    user_id: 0,
    status:"on",
    thread: 0,
    thread_part: 0,
    users: []
  }
  private _members: BehaviorSubject<User[]>

  constructor(private api: ApiService) { }

  setUserId(id) {
    this.dif.user_id = id
  }
  setMembers(members: BehaviorSubject<User[]>) {
    this._members = members
  }
  run() {
    if (this.timer === null) {
      this.timer = 0
      this.timerHandler()
    }
  }
  stop() {
    if (this.timer !== null) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  private checkUsersDiff(users: number[]) {
    let _findId: number
    const findUser = id => id == _findId
    const s = this._members
    let change = false
    if(s) {
      const l = s.getValue()
      if(l) {
        for (const m of l) {
          _findId = m.id
          const _on = users.find(findUser)
          const ns: WatchStatus = _on ? "on":"off"
          const cs: WatchStatus = m.status == "on" ? "on":"off"
          if(ns != cs) {
            change = true
            m.status = ns
          }
        }
      }
    }
    return change
  }
  private _checkUsersDiff(previous: any[], current: any[]) {
    const n = current.length
    const _usersOn = this.users
    let _findId: number
    const findUser = status => status == _findId
    let _usersOnChange = false
    for (const _currentStatus of current) {
      _findId = _currentStatus.id
      const _status = _usersOn.find(findUser)
      if(_status) {
        const i = _usersOn.indexOf(_status)
        if(_currentStatus.status == "off") {
          _usersOn.splice(i, 1)
          _usersOnChange = true
        }
        else {
          if(i != -1)
            _usersOn.push(_currentStatus)
            _usersOnChange = true
        }
      }
    }
    const _members = this._members
    if(_members) {
      let notify = false
      const l = _members.getValue()
      for (const _m of l) {
        _findId = _m.id
        const _on = _usersOn.find(findUser)
        const _ns: WatchStatus = _on ? "on":"off"
        const _cs: WatchStatus = _m.status == "on" ? "on":"off"
        if(_ns != _cs) {
          notify = true
        }
        _m.status = _ns
      }
      if(notify)
        _members.next(l)      
    }
    if (_usersOnChange || previous.length != n)
      return true
    for (let i = 0; i < n; i++) {
      const status = current[i];
      _findId = status.id
      const old = previous.find(findUser)
      if(old) {
        if(old.status != status.status)
          return true
      }
      else
        return true
    }
    for (let i = 0; i < n; i++) {
      const old = previous[i];
      _findId = old.id
      const status = current.find(findUser)
      if(status) {
        if(old.status != status.status)
          return true
      }
      else
        return true
    }
    return false
  }

  private timerHandler = () => {
    this.timer = setTimeout(() => {
      const diff: WatchDiff = this.dif
      this.api.watch(diff).pipe(first()).subscribe(result => {

        if (result.thread != diff.thread)
          this.$thread.emit(result.thread)

        if (result.thread_part != diff.thread_part)
          this.$threadPart.emit(result.thread_part)

        if(! this.checkUsersDiff(result.users))
          this.$users.emit(diff.users)
        
        diff.thread = result.thread
        diff.thread_part = result.thread_part

        if(diff.status == "on") {
          diff.status = ""
        }
        this.timerHandler()
      })
    }, 3000)
  }
  users: number[] = []
  thread: number = NaN
  threadPart: number = NaN
  $thread: EventEmitter<number> = new EventEmitter()
  $threadPart: EventEmitter<number> = new EventEmitter()
  $users: EventEmitter<number[]> = new EventEmitter()
}
