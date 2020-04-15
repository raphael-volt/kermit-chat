import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
  host: {
    class:"thread-component flex-column flex11"
  }
})
export class ThreadComponent implements OnInit, OnDestroy {

  threadId = 0

  private sub: Subscription

  constructor(route: ActivatedRoute) {

    this.sub = route.paramMap.subscribe(map => {
      if (map.has('id')) {
        this.setupThread(+map.get('id'))
      }
    })
  }


  private setupThread(id: number) {

  }
  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.sub)
      this.sub.unsubscribe()
  }

}
