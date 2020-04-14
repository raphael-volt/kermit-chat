import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  constructor(private dialog: MatDialog) { }

  private dialogRef: MatDialogRef<MatProgressSpinner>
  open() {
    if (this.dialogRef) return
    this.dialogRef = this.dialog.open(MatProgressSpinner, {
      panelClass: "dialog-container-transparent",
      hasBackdrop: true
    })
    const instance = this.dialogRef.componentInstance
    instance.diameter = 50
    instance.strokeWidth = 6
    instance.color = "primary"
    instance.mode = "indeterminate"
  }

  close() {
    if (!this.dialogRef) return
    this.dialogRef.close()
    this.dialogRef = null
  }
}
