import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'dialog-card',
  templateUrl: './dialog-card.component.html',
  styleUrls: ['./dialog-card.component.scss']
})
export class DialogCardComponent implements OnInit {

  contents: BehaviorSubject<string[]> = new BehaviorSubject([])
  constructor(private dialogRef: MatDialogRef<DialogCardComponent>) { }

  @Input()
  color: string = "primary"

  @Input()
  title: string

  
  @Input()
  subtitle: string

  set content(value: string) {
    const contents = this.contents.getValue()
    contents.push(value)
    this.contents.next(contents)
  }
  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close()
  }

}
