import { Component, OnInit, Input } from '@angular/core';
import { EmojiList } from '../emoji';

@Component({
  selector: 'app-emoji-list',
  templateUrl: './emoji-list.component.html',
  styleUrls: ['./emoji-list.component.scss']
})
export class EmojiListComponent implements OnInit {

  @Input()
  collection: EmojiList
  
  constructor() { }

  ngOnInit(): void {
    console.log("EmojiListComponent.ngOnInit")
  }

}
