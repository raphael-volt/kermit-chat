import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmojiSelectComponent } from '../mat-emoji/emoji-select/emoji-select.component';

@Component({
  selector: 'app-debug-emoji',
  templateUrl: './debug-emoji.component.html',
  styleUrls: ['./debug-emoji.component.scss']
})
export class DebugEmojiComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  showEmojiSelector() {
    this.dialog.open(EmojiSelectComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: false,
      restoreFocus: true
    })
  }

}
