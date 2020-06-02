import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'src/app/vo/vo';
import { UserService } from 'src/app/api/user.service';
import { first } from 'rxjs/operators';
import { WatchService } from 'src/app/api/watch.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  host: {
    class: "main-view"
  }
})
export class MembersComponent implements OnInit, OnDestroy {

  members: BehaviorSubject<User[]> = new BehaviorSubject(null)
  displayedColumns: string[] = ['name', 'email', 'status']
  private usersSub: Subscription
  private watchSub: Subscription

  constructor(private userService: UserService, private watch: WatchService) { }

  ngOnInit(): void {

    if (this.userService.busy) {
      this.userService.getUsers().pipe(first()).subscribe(this.initMembers)
      return
    }
    this.initMembers(this.userService.users)
  }

  private initMembers = (users) => {
    this.members.next(users)
    this.watch.setMembers(this.members)
  }

  ngOnDestroy() {
    if (this.usersSub && !this.usersSub.closed) {
      this.usersSub.unsubscribe()
      this.usersSub = null
    }
    if (this.watchSub) {
      this.watchSub.unsubscribe()
      this.watchSub = null
    }
  }

}
