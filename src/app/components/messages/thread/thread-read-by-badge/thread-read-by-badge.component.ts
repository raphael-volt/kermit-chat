import { Component, Input, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Thread } from 'src/app/vo/vo';
import { ContextService } from 'src/app/context.service';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'thread-read-by-badge',
  templateUrl: './thread-read-by-badge.component.html',
  styleUrls: ['./thread-read-by-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThreadReadByBadgeComponent implements OnDestroy {

  private sub: Subscription

  constructor(private users: ContextService, private api: ApiService, private cdr: ChangeDetectorRef) { 
    this.sub = api.threadChange.subscribe(thread=>{
      if(this._thread == thread) {
        this.thread = thread
        this.cdr.detectChanges()
      }

    })
  }
  ngOnDestroy(): void {
    if(this.sub)
      this.sub.unsubscribe()
  }

  numThread = 0
  isHidden = true
  private _thread: Thread
  @Input()
  set thread(value: Thread) {
    let n = 0
    this._thread = value
    if (value) {
      const id = this.users.user.id
      const o = value.read_by
      for (const k in o) {
        if (o[k].indexOf(id) < 0) {
          n++
        }
      }
    }
    this.numThread = n
    this.isHidden = n == 0
  }

}
