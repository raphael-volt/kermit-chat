import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SigninComponent } from './signin/signin.component';
import { Observable } from 'rxjs';
import { User, Thread, ThreadTree } from '../vo/vo';
import { CreateThreadComponent } from '../components/messages/create-thread/create-thread.component';

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
}
