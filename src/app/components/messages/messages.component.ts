import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DialogService } from 'src/app/dialog/dialog.service';
import { first } from 'rxjs/operators';
import { ApiService } from 'src/app/api/api.service';

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
  
  constructor(private dialog: DialogService, public api: ApiService) { }
  ngOnInit(): void {
    this.createThread()
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
