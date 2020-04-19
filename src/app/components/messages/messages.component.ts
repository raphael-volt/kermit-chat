import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DialogService } from 'src/app/dialog/dialog.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  host: {
    class:"main-view"
  }
})
export class MessagesComponent implements OnInit {

  threadOpen: boolean = false
  links: any[]
  constructor(private dialog: DialogService) {
    const links: any[] = []
    for (let i = 1; i < 31; i++) {
      links.push({ id: i, subject: "Message de jp-user " + (i) })
    }
    this.links = links
  }
  ngOnInit(): void {
    
  }
  @ViewChild("navList")
  private _navList: ElementRef

  onDeactivate($event){
    this.threadOpen = false
  }
  
  onActivate($event){
    this.threadOpen = true
  }

  createThread() {
    this.dialog.openThreadEditor().pipe(first()).subscribe(tree=>{
      if(tree) {
        console.log(tree.thread.subject)
        console.log(tree.parts[0].content)
      }
    })
  }

}
