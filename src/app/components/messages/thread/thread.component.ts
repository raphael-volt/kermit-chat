import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
import { User, ThreadData } from 'src/app/vo/vo';
import { ApiService } from 'src/app/api/api.service';
import { first } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/api/user.service';



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
  constructor(route: ActivatedRoute, 
    private api: ApiService, 
    private userService: UserService,
    private cdr: ChangeDetectorRef) {

    this.messageControl = new FormControl(null, Validators.required)
    this.sub = this.messageControl.statusChanges.subscribe(value => {
      cdr.detectChanges()
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
    const userService = this.userService
    if (! userService.busy) {
      return this.loadThread(id)
    }

    userService.getUsers().pipe(first()).subscribe(users=>{
      this._users = users
      this.loadThread(id)
    })
  }

  private loadThread(id: number) {
    this.api.getThreadData(id).pipe(first()).subscribe(data => {
      const userService = this.userService
      if (data.contents.length > 10)
        data.contents.splice(10, data.contents.length - 10)
      data.user = userService.findById(data.user_id)
      for (const item of data.contents) {
        item.user = userService.findById(item.user_id)
      }
      this.thread = data
      this.threadData.next(data)
      this.cdr.detectChanges()
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
