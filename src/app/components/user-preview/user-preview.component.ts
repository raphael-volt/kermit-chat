import { Component, Input, OnChanges, 
  SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { User } from 'src/app/vo/vo';
import { first } from 'rxjs/operators';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { UserService } from 'src/app/api/user.service';
import { Subscription } from 'rxjs';

const PREVIEW_SIZES = [52, 48, 22]
export type PreviewSizeLabels = "large"|"medium"|"small"
@Component({
  selector: 'user-preview',
  templateUrl: './user-preview.component.html',
  styleUrls: ['./user-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'user-preview fx-clr',
    '[class.large]': 'pictoSize == "large"',
    '[class.small]': 'pictoSize == "small"',
    '[class.medium]': 'pictoSize == "medium"',
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
  pictoSize: PreviewSizeLabels = "small"

  avatarSize: number = PREVIEW_SIZES[2]
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

    let detect = false
    if (changes.pictoSize) { 
      let label: PreviewSizeLabels = changes.pictoSize.currentValue
      let size = PREVIEW_SIZES[2]
      switch (label) {
        case "large":
          size = PREVIEW_SIZES[0]
          break;
          
        case "medium":
          size = PREVIEW_SIZES[1]
          break;
      }
      this.avatarSize = size
      detect = true
    }
    if (changes.user) {
      const user = changes.user.currentValue as User
      if (!user || !user.picto)
        this.hasPicto = false
      else {
        this.hasPicto = true
      }
      detect = true
    }
    if(detect) this.cdr.detectChanges()
  }

}
