import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { User, isUser } from 'src/app/vo/vo';

@Component({
  selector: 'user-preview',
  templateUrl: './user-preview.component.html',
  styleUrls: ['./user-preview.component.scss']
})
export class UserPreviewComponent implements OnInit, OnChanges {

  @Input()
  user: User = {}

  hasPicto = false

  @Input()
  showName = true

  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.user) {
      const user = changes.user.currentValue
      if (!user || !isUser(user))
        this.hasPicto = false
      else {
        this.hasPicto=true
      }
    }
  }

}
