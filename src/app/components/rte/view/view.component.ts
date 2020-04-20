import { Component, OnInit, Input } from '@angular/core';
import { Delta, DeltaOperation } from 'quill';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'rte-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  modules = {}
  @Input()
  content: any
  @Input()
  set inserts(value: any[]) {
    let current = this.content
    if (current)
      current.ops = value
    else
      current = { ops: value }
    //this.content.next(current)
  }

  constructor() { }

  ngOnInit(): void {

  }

}
