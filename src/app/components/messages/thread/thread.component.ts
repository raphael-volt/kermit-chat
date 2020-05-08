import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
import { User, ThreadData, ThreadPart } from 'src/app/vo/vo';
import { ApiService } from 'src/app/api/api.service';
import { first } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/api/user.service';
import { Delta, DeltaOperation } from 'quill';



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

  asyncThreadData: BehaviorSubject<ThreadData> = new BehaviorSubject<ThreadData>(null)
  threadData: ThreadData
  get thread() {
    return this.threadData.thread
  }
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

  private setupThread(id: number) {
    const userService = this.userService
    if (!userService.busy) {
      return this.loadThread(id)
    }

    userService.getUsers().pipe(first()).subscribe(users => {
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
      this.threadData = data
      this.asyncThreadData.next(data)
      this.cdr.detectChanges()
    })

  }

  reply(event: MouseEvent) {
    event.stopImmediatePropagation()
    event.preventDefault()
    const data = this.messageControl.value
    const ops = (data.content as Delta).ops
    const tp: ThreadPart = {
      thread_id: this.thread.id,
      user_id: this.thread.user_id,
      content: ops
    }
    this.api.reply(tp).pipe(first()).subscribe(tp=>{
      this.threadData.contents.push({
        user_id: this.thread.user_id,
        user: this.userService.user,
        inserts: tp.content as DeltaOperation[]
      })
      this.cdr.detectChanges()
    })
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
