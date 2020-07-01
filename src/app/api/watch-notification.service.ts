import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { WatchStatus, User } from '../vo/vo';
import { Subject } from 'rxjs';
import { SnackBarUserOnComponent } from '../components/snack-bar-user-on/snack-bar-user-on.component';
import { first } from 'rxjs/operators';

export type NotificationType = 'userOn' | 'userOff' | 'message' | 'reply' | 'hello'
class PendingNotification {

  constructor(
    public type: NotificationType,
    public message: string,
    public data?: any,
    public config?: MatSnackBarConfig
  ) { }
}
@Injectable({
  providedIn: 'root'
})
export class WatchNotificationService {


  opening: Subject<NotificationType> = new Subject()

  private opened: boolean = false

  private pendingNotifications: PendingNotification[] = []

  private config: MatSnackBarConfig = {
    duration: 3000,
    verticalPosition: "top",
    horizontalPosition:"right"
  }
  constructor(
    private snackBar: MatSnackBar) {
  }


  getName(user) {
    if (!user)
      return 'UNDEFINED'
    if ("name" in user)
      return user.name
    return String(user)
  }
  message(user: User) {
    this.open(`Nouveau message de ${this.getName(user)}`, 'message')
  }

  reply(user: User) {
    this.open(`${this.getName(user)} a ajouté une réponse`, 'reply')
  }

  user(user: User, status: WatchStatus = '') {
    if (status == '')
      status = user.status
    const message = [`${this.getName(user)} s'est`]
    switch (status) {
      case 'on':
        message.push('connecté')
        this.opening.next('userOn')
        break;

      case 'off':
        message.push('déconnecté')
        this.opening.next('userOff')

        break;

      default:
        return;
    }
    this.open(message.join(' '), 'userOn')
  }

  private appendNotification(type: NotificationType, message: string, data: any = null, config:MatSnackBarConfig = null
  ) {
    this.pendingNotifications.push(new PendingNotification(type, message, data, config))
    this.nextNotification()
  }

  open(message, type: NotificationType, config = null) {
    if (!config)
      config = this.config
    this.appendNotification(type, message, null, config)
  }

  usersOn(users: User[]) {
    this.appendNotification('userOn', null, Object.assign({ data: users }, this.config))
  }

  private nextNotification() {
    if(! this.opened) {
      this.opened = true
      const notif = this.pendingNotifications.shift()
      const ref = notif.data ? this.snackBar.openFromComponent(SnackBarUserOnComponent, notif.data):this.snackBar.open(notif.message, '', notif.config)
      this.opening.next(notif.type)
      ref.afterDismissed().pipe(first()).subscribe(_=>{
        this.opened = false
        if(this.pendingNotifications.length)
          this.nextNotification()
      })
    }

  }
}