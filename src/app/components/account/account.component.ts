import { Component, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { User } from 'src/app/vo/vo';
import { AvatarType } from 'src/app/avatar/avatar.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from 'src/app/api/user.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { PictoViewComponent } from '../picto-view/picto-view.component';
import { first } from 'rxjs/operators';

class BoolControl extends FormControl {
  constructor(formState) {
    super(formState)
  }
  setValue(value, options?) {
    super.setValue(value ? 1:0, options)
  }
}
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

  userPreview: User
  user: User

  pictoFile: File | string | ArrayBuffer

  changed: boolean = false

  formGroup: FormGroup

  @ViewChild(PictoViewComponent)
  pictoView: PictoViewComponent

  private formSub: Subscription
  private pictoValidator: FormControl

  constructor(
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private auth: AuthService,
    formBuilder: FormBuilder) {

    this.userPreview = this.user = userService.user

    this.setUpFormGroup(formBuilder, userService.user)
  }
  ngOnDestroy(): void {
    if (this.formSub)
      this.formSub.unsubscribe()
  }

  clearChanges() {
    const g = this.formGroup
    const user = this.userService.findById(this.user.id)
    g.setValue({
      email: user.email,
      name: user.name,
      picto: user.picto,
      notify_by_email: user.notify_by_email,
      allow_sounds: user.allow_sounds
    })
    this.changed = false
    this.pictoView.checkImgSrc(user, true)
    this.cdr.detectChanges()
  }
  private setUpFormGroup(fb: FormBuilder, user: User) {
    this.pictoValidator = new FormControl(user.picto, control => {

      return null
    })
    const g = fb.group({
      email: [user.email, [Validators.required, Validators.email]],
      name: [user.name, [Validators.required, Validators.minLength(3)]],
      picto: this.pictoValidator,
      notify_by_email: new BoolControl(user.notify_by_email),
      allow_sounds: new BoolControl(user.allow_sounds)
    })

    g.controls.notify_by_email

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
    const user = this.userService.findById(this.user.id)
    const userChanges: User = { id: user.id }
    for (const k in g.value) {
      if(g.value[k] != user[k])
        userChanges[k] = g.value[k]
    }
    /*
    this.userService.updateUser(userChanges).pipe(first()).subscribe(result=>{
      Object.assign(user, result);
      this.user.picto = result.picto
      if("email" in userChanges) {
        this.auth.saveUser(user)
      }
      // bugfix change detection
      this.userPreview = Object.assign({}, user)
      this.clearChanges()
      this.cdr.detectChanges()
    })
    */
  }

  logout() {
    this.userService.signout().then(_=>{
      this.auth.logout()
    })
  }
}
