import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  host: {
    class:"main-view fx-coll"
  }
})
export class EditorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
