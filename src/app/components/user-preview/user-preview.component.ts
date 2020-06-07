import { Component, Input, OnChanges, 
  SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { User } from 'src/app/vo/vo';
import { first } from 'rxjs/operators';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { UserService } from 'src/app/api/user.service';

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
export class UserPreviewComponent implements OnChanges {

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

  constructor(private cdr: ChangeDetectorRef, private userService: UserService) { }
  
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
