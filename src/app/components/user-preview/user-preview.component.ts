import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { User, isUser } from 'src/app/vo/vo';
import { ApiService } from 'src/app/api/api.service';
import { first } from 'rxjs/operators';
import { coerceNumberProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'user-preview',
  templateUrl: './user-preview.component.html',
  styleUrls: ['./user-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'user-preview',
    '[class.large]': 'pictoSize == "large"',
    '[class.small]': 'pictoSize == "small"',
  }
})
export class UserPreviewComponent implements OnInit, OnChanges, OnDestroy {

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

  constructor(private cdr: ChangeDetectorRef, private api: ApiService) { }
  ngOnDestroy(): void {
    //throw new Error("Method not implemented.");
  }

  private getUserFlag = false
  private getUser(id: number) {

    const members = this.api.members.getValue()
    if (members) {
      if(this.findUser(members, id))
        return
    }
    this.api.getMembers().pipe(first()).subscribe(value=>{
      this.findUser(value, id)
    })
    /*
    this.api.getMembers().pipe(first()).subscribe(value=>{
      this.findUser(value, id)
    })
    */
  }
  private findUser(users: User[], id: number) {
    const user = users.find(user => user.id == id)
    if(user) {
      this.user = user
      this.hasPicto = user.picto !== null
      this.cdr.detectChanges()
      return true
    }
    return false
  }
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes.user) {
      const user = changes.user.currentValue as User
      console.log('PICTO ', user?.email)
      if (!user || !user.picto)
        this.hasPicto = false
      else {
        this.hasPicto = true
      }
    }
  }

}
