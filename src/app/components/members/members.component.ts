import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'src/app/vo/vo';
import { UserService } from 'src/app/api/user.service';
import { first } from 'rxjs/operators';
import { DialogService } from 'src/app/dialog/dialog.service';
import { CreateUserComponent } from './create-user/create-user.component';
import { PromptDeleteUserComponent } from './prompt-delete-user/prompt-delete-user.component';

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

  constructor(private userService: UserService, private dialog: DialogService) {

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
    this.dialog.open(PromptDeleteUserComponent, {
      disableClose: true,
      closeOnNavigation: false,
      autoFocus: true
    })
      .afterClosed().pipe(first()).subscribe(value => {
        if (value === true)
          this.userService.deleteUser(user)
      })
  }
  createUser() {
    this.dialog.open(CreateUserComponent, {
      disableClose: true,
      closeOnNavigation: false,
      autoFocus: true
    }).afterClosed().subscribe(user => {
      location.reload()
    })
  }

}
