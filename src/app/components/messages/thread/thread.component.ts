import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { User, ThreadData, ThreadPart, ThreadDataItem } from 'src/app/vo/vo';
import { ApiService } from 'src/app/api/api.service';
import { first } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/api/user.service';
import { Delta, DeltaOperation } from 'quill';
import { BusyService } from 'src/app/api/busy.service';
import { WatchService } from 'src/app/api/watch.service';




@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
  host: {
    class: "thread-component"
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThreadComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef;
  @ViewChildren('thread-part') itemElements: QueryList<any>;

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
  currentUser: User
  constructor(
    route: ActivatedRoute,
    watch: WatchService,
    private api: ApiService,
    private userService: UserService,
    private busy: BusyService,
    private cdr: ChangeDetectorRef) {

    busy.open()
    this.currentUser = userService.user
    this.messageControl = new FormControl(null, Validators.minLength(1))
    this.sub = this.messageControl.statusChanges.subscribe(value => {
      cdr.detectChanges()
    })

    this.sub = route.paramMap.subscribe(map => {
      if (map.has('id')) {
        this.setupThread(+map.get('id'))
      }
    })
    this.sub = watch.$threadPart.subscribe(id => {
      const data = this.threadData
      if(! data)
        return
      const tid = data.thread.id
      if(tid == watch.thread)
        this.updateReplies()
    })
  }

  private updateReplies() {
    const replies =  this.replies
    this.api.getThreadData(this.threadData.thread.id).pipe(first()).subscribe(data => {
      const newContents = data.contents
      const currentContents = this.threadData.contents
      const k = newContents.length
      let _id: number
      const findPart = (part: ThreadDataItem) => part.id == _id 
      for (let i = 0; i < k; i++) {
        const reply = newContents[i]
        _id = reply.id
        const r = replies.find(findPart)
        if(! r) {
          console.log("new reply")
          reply.user = this.userService.findById(reply.user_id)
          currentContents.push(reply)
          replies.push(reply)
          this.cdr.detectChanges()
        }
      }
    })
  }

  ngAfterViewInit(): void {
    //this.checkScrollHandler()
  }

  private checkScrollHandler() {
    if (this.scrollFrame && !this.scrollContainer) {
      this.scrollContainer = this.scrollFrame.nativeElement;
      this.itemElements.changes.subscribe(_ => this.onItemElementsChanged())
    }
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

  private appendThreadPartAsync(contents: ThreadDataItem[], service: UserService) {
    return new Observable<boolean>(obs => {
      contents = contents.slice()
      const cdr = this.cdr
      const next = () => {
        if (contents.length) {
          window.requestAnimationFrame(() => {
            const data = contents.shift()
            data.user = service.findById(data.user_id)
            this.replies.push(data)
            cdr.detectChanges()
            next()
          })
        }
        else {
          obs.next(true)
          obs.complete()
        }
      }
      next()
    })
  }

  replies: ThreadDataItem[] = []

  private loadThread(id: number) {
    this.api.getThreadData(id).pipe(first()).subscribe(data => {
      const userService = this.userService
      data.user = userService.findById(data.user_id)
      this.threadData = data
      this.asyncThreadData.next(data)
      this.cdr.detectChanges()
      this.appendThreadPartAsync(data.contents, userService).pipe(first()).subscribe(done => {
        this.busy.close()
        this.checkScrollHandler()
        this.cdr.detectChanges()
      })
    })

  }

  panelCloseHandler() {
    this.panelOpenState = false
    this.cdr.detectChanges()
    if (this.replyFlag) {
      this.replyFlag = false
      this.scrollToBottom()
      const data = this.messageControl.value
      const ops = (data.content as Delta).ops
      const tp: ThreadPart = {
        thread_id: this.thread.id,
        user_id: this.currentUser.id,
        content: ops
      }
      this.api.reply(tp).pipe(first()).subscribe(tp => {
        this.messageControl.setValue(null)
        this.replies.push({
          user_id: this.currentUser.id,
          user: this.currentUser,
          id: tp.id,
          inserts: tp.content as DeltaOperation[]
        })
        this.cdr.detectChanges()
      })
      this.messageControl.setValue(null)
    }
  }

  private replyFlag = false

  reply(event: MouseEvent) {
    //event.stopImmediatePropagation()
    //event.preventDefault()
    this.replyFlag = true

  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    for (let sub of this.subs)
      sub.unsubscribe()
    this.subs = null
  }

  private scrollContainer: any;
  private isNearBottom = false;


  private onItemElementsChanged(): void {
    if (this.busy.busy) return
    if (this.isNearBottom) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  private isUserNearBottom(): boolean {
    const threshold = 150;
    const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  scrolled(event: any): void {
    if (this.busy.busy) return
    window.requestAnimationFrame(() => {
      this.isNearBottom = this.isUserNearBottom()
    })
  }

}
