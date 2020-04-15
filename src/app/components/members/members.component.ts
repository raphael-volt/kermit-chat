import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'src/app/vo/vo';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  host: {
    class:"main-view"
  }
})
export class MembersComponent implements OnInit, OnDestroy {

  members: BehaviorSubject<User[]> = new BehaviorSubject(null)
  displayedColumns: string[] = ['name', 'email']
  private usersSub: Subscription
  
  constructor(private api: ApiService) { }
  
  ngOnInit(): void {
    this.usersSub = this.api.getMembers().subscribe(users => {
      this.members.next(users)
    })
  }

  ngOnDestroy() {
    if(this.usersSub && ! this.usersSub.closed) {
      this.usersSub.unsubscribe()
      this.usersSub = null
    }
  }

}
