import { Component, Input, OnChanges, 
  SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { User } from 'src/app/vo/vo';
import { first } from 'rxjs/operators';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { UserService } from 'src/app/api/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'user-preview',
  templateUrl: './user-preview.component.html',
  styleUrls: ['./user-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'user-preview fx-clr',
    '[class.large]': 'pictoSize == "large"',
    '[class.small]': 'pictoSize == "small"',
  }
})
export class UserPreviewComponent implements OnChanges, OnDestroy {

  @Input()
  user: User


  @Input()
  set userId(value: any) {
    value = coerceNumberProperty(value)
    this.getUser(value)
  }

  @Input()
  pictoSize = "large"

  hasPicto = false

  @Input()
  showName = false

  private userChangeSub: Subscription
  constructor(private cdr: ChangeDetectorRef, private userService: UserService) { 
    this.userChangeSub = userService.usersChange.subscribe(()=>{
      this.cdr.detectChanges()
    })
  }
  ngOnDestroy(): void {
    this.userChangeSub.unsubscribe() 
  }
  
  private getUser(id: number) {
    this.userService.getUser(id).pipe(first()).subscribe(this.setUser)
  }

  private setUser = (user: User) => {
    this.user = user
    this.hasPicto = user.picto !== null
    this.cdr.detectChanges()
  }
  
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.user) {
      const user = changes.user.currentValue as User
      if (!user || !user.picto)
        this.hasPicto = false
      else {
        this.hasPicto = true
      }
      this.cdr.detectChanges()
    }
  }

}
