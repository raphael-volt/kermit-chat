import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  links: string[]
  constructor() { 
    const links: string[] = []
    for (let i = 1; i < 31; i++) {
      links.push("Message " + (i))
    }
    this.links = links
  }

  openThread(thread) {
    console.log(`open thread '${thread}'`)
  }

  ngOnInit(): void {
  }

}
