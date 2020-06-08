import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { User, ThreadData, ThreadPart, ThreadDataItem } from 'src/app/vo/vo';
import { ApiService } from 'src/app/api/api.service';
import { first } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/api/user.service';
import { Delta, DeltaOperation } from 'quill';
import { BusyService } from 'src/app/api/busy.service';
import { WatchService } from 'src/app/api/watch.service';
import { RteComponent, RteData } from '../../rte/editor/rte.component';
import { ContextService } from 'src/app/context.service';
import { WatchNotificationService } from 'src/app/api/watch-notification.service';
import { RteDialogComponent } from '../../rte-dialog/rte-dialog.component';
import { DialogService } from 'src/app/dialog/dialog.service';

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
  @ViewChild(RteComponent) rte: RteComponent

  readbyText = ""

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
    private context: ContextService,
    private notifier: WatchNotificationService,
    private api: ApiService,
    private userService: UserService,
    private busy: BusyService,
    private cdr: ChangeDetectorRef,
    private dialog: DialogService) {

    this.currentUser = userService.user
    this.messageControl = new FormControl(null, (control) => {
      const data: RteData = control.value
      if (data && data.length > 0) {
        return null
      }
      return { minLength: 1 }
    })
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
      if (!data)
        return
      const tid = data.thread.id
      if (tid == watch.thread)
        this.updateReplies()
    })
  }

  private notifyUserInThread(newInThread: number[], currentUser: number) {
    if (!newInThread || !newInThread.length)
      return

    newInThread = newInThread.filter(id => id != currentUser)
    if (!newInThread.length)
      return
    const context = this.context
    let message: string
    const names = newInThread.map(id => context.findUser(id).name)
    if (newInThread.length == 1) {
      message = `${names[0]} lit le message`
    }
    else {
      message = `${names.join(", ")} lisent le message`
    }
    this.notifier.open(message)
  }
  private usersInThread: number[] = []
  private updateReadByText() {
    const context = this.context
    const currentActive = context.activeThreads[context.threadOpened]
    if (!currentActive) return
    const currentUser = context.user.id
    const thread = this.threadData.thread
    const threadUser: number = thread.user_id
    if (!this.initNotify) {
      this.notifyUserInThread(currentActive, currentUser)
    }
    else {
      let current = currentActive
      let newInThread: number[] = []
      for (const uid of currentActive) {
        if (current.indexOf(uid) < 0)
          newInThread.push(uid)
      }
      this.notifyUserInThread(newInThread, currentUser)
    }
    this.usersInThread = currentActive
    const readByUsers: number[] = currentActive.slice().filter(id => id != threadUser)
    const readBy = thread.read_by
    for (const tpid in readBy) {
      const tpUsers: number[] = readBy[tpid]
      for (const uid of tpUsers) {
        if (uid == threadUser) continue
        const user = context.findUser(uid)
        if (!user) {
          console.log('USER NOT FOUND', uid)
          continue
        }
        if (readByUsers.indexOf(uid) < 0)
          readByUsers.push(uid)
      }
    }

    const userNames: string[] = readByUsers.map(uid => context.findUser(uid).name)
    if (!userNames.length)
      userNames.push('personne')
    const message: string = "Vu par: "
    this.readbyText = message + userNames.join(', ')
  }

  private updateReplies() {
    const replies = this.replies
    this.api.getThreadData(this.threadData.thread.id, this.userService.user.id).pipe(first()).subscribe(data => {
      const newContents = data.contents
      const currentContents = this.threadData.contents
      const k = newContents.length
      let _id: number
      const findPart = (part: ThreadDataItem) => part.id == _id
      for (let i = 0; i < k; i++) {
        const reply = newContents[i]
        _id = reply.id
        const r = replies.find(findPart)
        if (!r) {
          reply.user = this.userService.findById(reply.user_id)
          currentContents.push(reply)
          replies.push(reply)
          this.cdr.detectChanges()
          setTimeout(() => this.scrollToBottom(), 100)
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
    this.context.threadOpened = id
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
      const busy = this.busy
      busy.open()
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
          busy.close()
          obs.next(true)
          obs.complete()
        }
      }
      next()
    })
  }

  replies: ThreadDataItem[] = []
  private initNotify: boolean = false
  private loadThread(id: number) {
    this.context.threadOpened = id
    this.api.getThreadData(id, this.userService.user.id).pipe(first()).subscribe(data => {
      const userService = this.userService
      const uid = data.user_id
      data.user = userService.findById(uid)
      if (!this.initNotify) {
        this.sub = this.context.activeThreadReadChange.subscribe(users => {
          this.updateReadByText()
          this.initNotify = true
        })
      }
      this.threadData = data

      this.asyncThreadData.next(data)
      this.cdr.detectChanges()
      this.appendThreadPartAsync(data.contents, userService).pipe(first()).subscribe(done => {
        this.busy.close()
        this.checkScrollHandler()
        this.updateReadByText()
        this.cdr.detectChanges()
      })
    })

  }

  afterExpand() {
    this.rte.focusEditor()
    /*
    this.messageControl.setValue(null)
    this.messageControl.updateValueAndValidity()
    this.cdr.detectChanges()
    */
  }
  panelCloseHandler() {
    this.panelOpenState = false
    this.cdr.detectChanges()
    if (this.replyFlag) {
      this.replyFlag = false
    }
  }

  private replyFlag = false

  reply(event: MouseEvent) {
    if (event) {
      event.stopImmediatePropagation()
      event.preventDefault()
    }

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
      this.rte.focusEditor()
      setTimeout(() => {
        this.scrollToBottom()
      }, 100)
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    for (let sub of this.subs)
      sub.unsubscribe()
    this.subs = null
  }

  private scrollContainer: HTMLElement;
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

  openRtePopup() {
    const sub = this.dialog.openThreadReply(this.messageControl).subscribe(data => {
      if (data)
        this.reply(null)
      else {
        this.messageControl.setValue(null)
        this.messageControl.updateValueAndValidity()
        this.cdr.detectChanges()
      }
    })
  }

}
