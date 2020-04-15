import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  host: {
    class:"main-view"
  }
})
export class AccountComponent implements OnInit {

  links: any[]
  constructor() {
    const links: any[] = []
    for (let i = 1; i < 31; i++) {
      links.push({ id: i, subject: "Message " + (i) })
    }
    this.links = links
  }
  ngOnInit(): void {
  }

}
