import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'src/app/vo/vo';
import { UserService } from 'src/app/api/user.service';
import { first } from 'rxjs/operators';

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
  
  constructor(private userService: UserService) { }
  
  ngOnInit(): void {

    if(this.userService.busy) {
      this.userService.getUsers().pipe(first()).subscribe(users=>{
        this.members.next(users)
      })
      return
    }
    this.members.next(this.userService.users)
  }

  ngOnDestroy() {
    if(this.usersSub && ! this.usersSub.closed) {
      this.usersSub.unsubscribe()
      this.usersSub = null
    }
  }

}
