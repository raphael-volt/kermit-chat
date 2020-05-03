import { Component, OnInit, Input } from '@angular/core';
import { Delta, DeltaOperation } from 'quill';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'rte-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  host: {
    "class": "rte view",
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy'
  }
})
export class ViewComponent implements OnInit {

  modules = {}
  @Input()
  content: any
  @Input()
  set inserts(value: any[]) {
    this.content = { ops: value }
  }

  constructor() { }

  ngOnInit(): void {

  }

}
