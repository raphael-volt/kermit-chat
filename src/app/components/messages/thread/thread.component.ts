import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
import { User, ThreadData } from 'src/app/vo/vo';
import { ApiService } from 'src/app/api/api.service';
import { first } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';



@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
  host: {
    class: "thread-component"
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThreadComponent implements OnInit, OnDestroy {

  threadData: BehaviorSubject<ThreadData> = new BehaviorSubject<ThreadData>(null)
  thread: ThreadData
  panelOpenState

  public set sub(v: Subscription) {
    this.subs.push(v)
  }

  private subs: Subscription[] = []

  messageControl: FormControl
  messageInvalid = true
  constructor(route: ActivatedRoute, private api: ApiService, private cdr: ChangeDetectorRef) {

    this.messageControl = new FormControl(null, Validators.required)
    this.sub = this.messageControl.statusChanges.subscribe(value => {
      cdr.detectChanges()
    })

    const users = api.members.getValue()
    if (users)
      this._users = users
    else
      this.sub = api.members.subscribe(members => {
        if (members) {
          this._users = members
          if (this.tread_id != 0)
            this.loadThread(this.tread_id)
        }

      })
    this.sub = route.paramMap.subscribe(map => {
      if (map.has('id')) {
        this.setupThread(+map.get('id'))
      }
    })
  }

  private _users: User[]

  private tread_id = 0
  private setupThread(id: number) {
    this.tread_id = id
    if (this._users) {
      this.loadThread(id)
    }
  }

  /**
   * 
   */
  private getUserMap(): { [key: number]: User } {
    const map = {}
    for (const user of this._users) {
      map[user.id] = user
    }
    return map;
  }

  private loadThread(id: number) {
    this.api.getThreadData(id).pipe(first()).subscribe(data => {
      if (data.contents.length > 10)
        data.contents.splice(10, data.contents.length - 10)
      const users = this.getUserMap()
      data.user = users[data.user_id]
      for (const item of data.contents) {
        item.user = users[item.user_id]
      }
      this.thread = data
      this.threadData.next(data)
    })

  }

  sendMessage(event: MouseEvent) {
    event.stopImmediatePropagation()
    event.preventDefault()
    const data = this.messageControl.value
    this.messageControl.setValue(null)
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    for (let sub of this.subs)
      sub.unsubscribe()
    this.subs = null
  }

}
