import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { User } from 'src/app/vo/vo';
import { AvatarType } from 'src/app/avatar/avatar.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/api/user.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { PictoViewComponent } from '../picto-view/picto-view.component';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  host: {
    class: "app-account"
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent implements OnDestroy {

  user: User

  pictoFile: File | string | ArrayBuffer

  changed: boolean = false

  formGroup: FormGroup

  @ViewChild(PictoViewComponent)
  pictoView: PictoViewComponent

  private formSub: Subscription
  private pictoValidator: FormControl
  avatarData: { type: AvatarType, name: string }[] = [
    { type: "female", name: "Féminin" },
    { type: "male", name: "Masculin" },
    { type: "avataaars", name: "Custom" },
    { type: "bottts", name: "Robot" },
    { type: "gridy", name: "Gridy" }
  ]

  constructor(
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private auth: AuthService,
    formBuilder: FormBuilder) {

    this.user = userService.user

    this.setUpFormGroup(formBuilder, userService.user)
  }
  ngOnDestroy(): void {
    if (this.formSub)
      this.formSub.unsubscribe()
  }

  clearChanges() {
    const g = this.formGroup
    const user = this.user
    g.setValue({
      email: user.email,
      name: user.name,
      picto: user.picto
    })
    this.changed = false
    this.cdr.detectChanges()
    this.pictoView.checkImgSrc(user, true)
  }
  private setUpFormGroup(fb: FormBuilder, user: User) {
    this.pictoValidator = new FormControl(user.picto, control => {

      return null
    })
    const g = fb.group({
      email: [user.email, [Validators.required, Validators.email]],
      name: [user.name, [Validators.required, Validators.minLength(3)]],
      picto: this.pictoValidator
    })

    this.formSub = g.valueChanges.subscribe(o => {
      const u = this.user
      let c = false
      for (const key in o) {
        if (u[key] != o[key]) {
          c = true
          break
        }
      }
      this.changed = c
    })

    this.formGroup = g
  }

  imgChange(value) {
    const fc = this.pictoValidator
    fc.setValue(value)
    fc.updateValueAndValidity()
    this.cdr.detectChanges()
  }

  save() {
    const g = this.formGroup
    const user: User = this.user
    const userChanges: User = { id: user.id }
    for (const k in g.value) {
      if(g.value[k] != user[k])
        userChanges[k] = g.value[k]
    }
    this.userService.updateUser(userChanges).pipe(first()).subscribe(result=>{
      Object.assign(user, result);
      if("email" in userChanges) {
        this.auth.saveUser(user)
      }
      this.clearChanges()
    })
  }

  logout() {
    this.userService.signout().then(_=>{
      this.auth.logout()
    })
  }
}
