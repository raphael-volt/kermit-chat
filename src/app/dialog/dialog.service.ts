import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SigninComponent } from './signin/signin.component';
import { Observable } from 'rxjs';
import { User, ThreadTree } from '../vo/vo';
import { CreateThreadComponent } from '../components/messages/create-thread/create-thread.component';
import { AvatarListComponent } from '../avatar/list/avatar-list.component';
import { DialogCardComponent } from './dialog-card/dialog-card.component';
import { FormControl } from '@angular/forms';
import { ReplyDialogComponent } from '../components/messages/reply-dialog/reply-dialog.component';
import { MatAvatarDialog, MatAvatarEncoderService, Avatar } from 'mat-avatars';
import { first } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private config: MatDialogConfig = {
    panelClass: "dialog-container-transparent",
    disableClose: true,
    closeOnNavigation: false,
    autoFocus: true
  }
  constructor(private dialog: MatDialog, private avatarEncoder: MatAvatarEncoderService) { }

  openSignin(): Observable<User> {
    const ref = this.dialog.open(SigninComponent, {
      disableClose: true,
      closeOnNavigation: false,
      autoFocus: true
    })
    return ref.afterClosed()
  }

  openThreadEditor(): Observable<ThreadTree> {
    const cfg: MatDialogConfig = { maxWidth: "100vw", maxHeight: "100vh" }
    const ref = this.dialog.open(CreateThreadComponent, {
      height: "80vh",
      width: "80vw",
      panelClass: "fx-dialog-panel"
    })
    return ref.afterClosed()
  }
  openThreadReply(control: FormControl): Observable<FormControl> {
    const ref = this.dialog.open(ReplyDialogComponent, {
      data: {control: control},
      height: "80vh",
      width: "80vw",
      panelClass: "fx-dialog-panel"
    })
    return ref.afterClosed()
  }


  openAvatarSelector(): Observable<string> {
    return new Observable(obs=>{
      this.dialog.open(MatAvatarDialog, {
        height: "80vh",
        width: "80vw",
        panelClass: "fx-dialog-panel",
        autoFocus: false
      }).afterClosed().pipe(first()).subscribe((avatar: Avatar) => {
        if (avatar) {
          this.avatarEncoder.encode(avatar).then(data => {
            obs.next(data)
            obs.complete()
          })
        }
        else {
          obs.next()
          obs.complete()
        }
      })
    })
  }


  error(...messages: string[]) {
    return this.alert("Erreur", true, ...messages)
  }

  alert(title: string, isBug: boolean, ...messages: string[]) {
    const ref = this.dialog.open(DialogCardComponent, this.config)
    const card: DialogCardComponent = ref.componentInstance
    card.title = title
    card.isBug = isBug
    for (const message of messages) {
      card.content = message
    }
    return ref.afterClosed()
  }

  open(component: any, cfg: MatDialogConfig = null) {
    if (!cfg)
      cfg = this.config
    const ref = this.dialog.open(component, cfg)
    return ref
  }
}
