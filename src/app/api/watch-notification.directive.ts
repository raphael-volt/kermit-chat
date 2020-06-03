import { Directive, OnDestroy, Input, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationType, WatchNotificationService } from './watch-notification.service';

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
    notifier: WatchNotificationService) {
    this.audio = ref.nativeElement
    this.sub = notifier.opening.subscribe(this.openingHandler)
    console.log('WatchNotificationDirective')
  }

  private openingHandler = (_type: NotificationType) => {
    console.log('openingHandler', _type, this._type)
    if(_type == this._type) {
      this.audio.play()
    }
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

}
