import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { WatchStatus, User } from '../vo/vo';
import { Subject } from 'rxjs';
import { SnackBarUserOnComponent } from '../components/snack-bar-user-on/snack-bar-user-on.component';

export type NotificationType = 'userOn' | 'userOff' | 'message' | 'reply'
@Injectable({
  providedIn: 'root'
})
export class WatchNotificationService {


  opening: Subject<NotificationType> = new Subject()

  private config: MatSnackBarConfig = {
    duration: 4000,
    verticalPosition: "top"
  }
  constructor(
    private snackBar: MatSnackBar) {

  }


  getName(user) {
    if(! user)
      return 'UNDEFINED'
    if( "name" in user)
      return user.name
    return String(user)
  }
  message(user: User) {
    this.open(`Nouveau message de ${this.getName(user)}`)
    this.opening.next('message')
  }

  reply(user: User) {
    this.open(`${this.getName(user)} a ajouté une réponse`)
    this.opening.next('reply')
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
    this.open(message.join(' '))
  }

  open(message, action = '', config = null) {
    if (!config)
      config = this.config
    this.snackBar.open(message, action, config)
  }

  usersOn(users: User[]) {
    this.snackBar.openFromComponent(SnackBarUserOnComponent, Object.assign({ data: users }, this.config))
  }
}