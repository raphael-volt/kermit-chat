import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'src/app/vo/vo';
import { UserService } from 'src/app/api/user.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  host: {
    class: "members-component"
  }
})
export class MembersComponent implements OnInit, OnDestroy {

  members: BehaviorSubject<User[]> = new BehaviorSubject(null)
  displayedColumns: string[] = ['name', 'email', 'status', 'action']
  private usersSub: Subscription

  constructor(private userService: UserService) { 

    if (this.userService.busy) {
      this.userService.getUsers().pipe(first()).subscribe(this.initMembers)
      return
    }
    this.initMembers(this.userService.users)
  }

  ngOnInit(): void {
    
  }

  private initMembers = (users) => {
    this.members.next(users)
  }

  ngOnDestroy() {
    if (this.usersSub && !this.usersSub.closed) {
      this.usersSub.unsubscribe()
      this.usersSub = null
    }
  }
  deleteUser(user: User) {

  }
  createUser() {

  }
  
}
