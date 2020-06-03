import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { UserService } from './user.service';
import { WatchStatus, User } from '../vo/vo';
import { Subject } from 'rxjs';

export type NotificationType = 'userOn' | 'userOff' | 'message' | 'reply'
export type UserOrId = User | number
@Injectable({
  providedIn: 'root'
})
export class WatchNotificationService {


  opening: Subject<NotificationType> = new Subject()

  private config: MatSnackBarConfig = {
    duration: 2000
  }
  constructor(
    private snackBar: MatSnackBar,
    private users: UserService) {

  }

  private getUser(user: UserOrId): User {
    if (typeof user == "number")
      return this.users.findById(user)
    return user
  }

  message(user: UserOrId) {

    const u = this.getUser(user)
    this.open(`Nouveau message de ${u.name}`)
    this.opening.next('message')
  }
  
  reply(user: UserOrId) {
    
    const u = this.getUser(user)
    this.open(`${u.name} a ajouté une réponse`)
    this.opening.next('reply')
  }
  
  user(user: UserOrId, status: WatchStatus = '') {
    const u = this.getUser(user)
    if (status == '')
    status = u.status
    const message = [`${u.name} s'est`]
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

}
