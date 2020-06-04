import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { User } from 'src/app/vo/vo';

@Component({
  selector: 'app-snack-bar-user-on',
  templateUrl: './snack-bar-user-on.component.html',
  styleUrls: ['./snack-bar-user-on.component.scss']
})
export class SnackBarUserOnComponent implements OnInit {

  hasOn = false
  hasOff = false
  usersOn = []
  usersOff = []
  constructor(@Inject(MAT_SNACK_BAR_DATA) public users: User[]) {
    let on = false
    let off = false
    for (const u of users) {
      if (u.status == "on") {
        on = true
        this.usersOn.push(u)
      }

      if (u.status == "off") { 
        off = true 
        this.usersOff.push(u)
      }
    }
    this.hasOn = on
    this.hasOff = off
  }

  ngOnInit(): void {
  }

}
