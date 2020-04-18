import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rte-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  constructor() { }
  content = [
    { insert: 'Hello ' },
    { insert: 'World!', attributes: { bold: true } },
    { insert: '\n' },
    { insert: {
        image:"https://avatars1.githubusercontent.com/u/14826665?s=460&u=84c5b8bfa41a17ade2f3ede0fc12c4a40918676e&v=4",

      },
      attributes: { width: 100 }
    }
  ]
  ngOnInit(): void {
    
  }

}
