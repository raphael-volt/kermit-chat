import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SigninComponent } from './signin/signin.component';
import { Observable } from 'rxjs';
import { User, ThreadTree } from '../vo/vo';
import { CreateThreadComponent } from '../components/messages/create-thread/create-thread.component';
import { AvatarListComponent } from '../avatar/list/avatar-list.component';
import { DialogCardComponent } from './dialog-card/dialog-card.component';
import { RteData } from '../components/rte/editor/rte.component';
import { RteDialogComponent } from '../components/rte-dialog/rte-dialog.component';
import { FormControl } from '@angular/forms';
/*
[{"insert":"(","attributes":null},
{"insert":"jardin-partage@ketmie.com","attributes":{"color":"#0066cc"}},{"insert":")","attributes":null},
{"insert":{"rteemoji":"emoji-joy"},"attributes":{"size":"24px"}},
{"insert":" ","attributes":{"size":"24px"}},
{"insert":{"rteemoji":"emoji-eyes"},"attributes":{"size":"24px"}},{"insert":")\n","attributes":null}
]
*/
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
    const ref = this.dialog.open(SigninComponent, {
      disableClose: true,
      closeOnNavigation: false,
      autoFocus: true
    })
    return ref.afterClosed()
  }

  openThreadEditor(): Observable<ThreadTree> {
    const cfg: MatDialogConfig = { maxWidth: "100vw", maxHeight: "100vh" }
    const ref = this.dialog.open(CreateThreadComponent, Object.assign(cfg, this.config))
    return ref.afterClosed()
  }
  openThreadReply(control: FormControl): Observable<RteData> {
    const cfg: MatDialogConfig = { maxWidth: "100vw", maxHeight: "100vh" }
    const ref = this.dialog.open(RteDialogComponent, Object.assign(cfg, this.config))
    ref.componentInstance.messageControl = control
    return ref.afterClosed()
  }


  openAvatarSelector(): Observable<string> {
    const ref = this.dialog.open(AvatarListComponent, this.config)
    return ref.afterClosed()
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
