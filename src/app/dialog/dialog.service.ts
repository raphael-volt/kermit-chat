import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SigninComponent } from './signin/signin.component';
import { Observable } from 'rxjs';
import { User } from '../vo/vo';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private config: MatDialogConfig = {
    panelClass: "mat-dialog-panel",
    disableClose: true
  }
  constructor(private dialog: MatDialog) { }

  openSignin(): Observable<User> {
    const ref = this.dialog.open(SigninComponent, this.config)
    return ref.afterClosed()
  }
}
