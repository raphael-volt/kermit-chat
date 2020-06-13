import { Directive, OnDestroy, Input, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationType, WatchNotificationService } from './watch-notification.service';
import { ContextService } from '../context.service';

@Directive({
  selector: '[soundNotification]'
})
export class WatchNotificationDirective implements OnDestroy {

  private _type: NotificationType
  @Input()
  set notificationType(value: NotificationType) {
    this._type = value
  }
  private sub: Subscription
  private audio: HTMLAudioElement

  constructor(
    ref: ElementRef<HTMLAudioElement>,
    notifier: WatchNotificationService,
    private context: ContextService) {
    this.audio = ref.nativeElement
    this.sub = notifier.opening.subscribe(this.openingHandler)
  }

  private openingHandler = (_type: NotificationType) => {
    if(! this.context.user.allow_sounds)
      return
    if(_type == this._type) {
      this.audio.play().catch(error=>{
        console.log(error)
      })
    }
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

}
