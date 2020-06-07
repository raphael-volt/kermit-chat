import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SigninComponent } from './signin/signin.component';
import { Observable } from 'rxjs';
import { User, ThreadTree } from '../vo/vo';
import { CreateThreadComponent } from '../components/messages/create-thread/create-thread.component';
import { AvatarListComponent } from '../avatar/list/avatar-list.component';
import { DialogCardComponent } from './dialog-card/dialog-card.component';

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
  constructor(private dialog: MatDialog) { }

  openSignin(): Observable<User> {
    const ref = this.dialog.open(SigninComponent, this.config)
    return ref.afterClosed()
  }

  openThreadEditor(): Observable<ThreadTree> {
    const ref = this.dialog.open(CreateThreadComponent, this.config)
    return ref.afterClosed()
  }

  
  openAvatarSelector(): Observable<string> {
    const ref = this.dialog.open(AvatarListComponent, this.config)
    return ref.afterClosed()
  }

  
  error(...messages: string[] ) {
    return this.alert("Erreur", true, ...messages)
  }
  
  alert(title:string, isBug: boolean, ...messages: string[] ) {
    const ref = this.dialog.open(DialogCardComponent, this.config)
    const card: DialogCardComponent = ref.componentInstance
    card.title = title
    card.isBug = isBug
    for (const message of messages) {
        card.content = message
    }
    return ref.afterClosed()
  }

  open(component: any, cfg: MatDialogConfig=null) {
    if(! cfg)
      cfg = this.config
    const ref = this.dialog.open(component, cfg)
    return ref
  }
}
