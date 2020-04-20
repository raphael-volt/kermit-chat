import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
import { User, ThreadData } from 'src/app/vo/vo';
import { ApiService } from 'src/app/api/api.service';
import { first } from 'rxjs/operators';



@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
  host: {
    class: "thread-component flex-column flex11"
  }
})
export class ThreadComponent implements OnInit, OnDestroy {

  threadData: BehaviorSubject<ThreadData> = new BehaviorSubject<ThreadData>(null)
  thread: ThreadData
  panelOpenState
  private threadId = 0

  public set sub(v: Subscription) {
    this.subs.push(v)
  }

  private subs: Subscription[] = []

  constructor(route: ActivatedRoute, private api: ApiService) {

    this.sub = route.paramMap.subscribe(map => {
      if (map.has('id')) {
        this.setupThread(+map.get('id'))
      }
    })
  }

  private _users: User[]

  private setupThread(id: number) {
    if (!this._users) {
      this.api.getMembers().pipe(first()).subscribe(users => {
        this._users = users
        this.loadThread(id)
      })
    }
    else
      this.loadThread(id)
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
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    for (let sub of this.subs)
      sub.unsubscribe()
    this.subs = null
  }

}
