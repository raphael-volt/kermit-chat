import { Component, OnInit, AfterViewInit } from '@angular/core';
import { User } from 'src/app/vo/vo';
import { ApiService } from 'src/app/api/api.service';
import { AvatarService, AvatarType } from 'src/app/avatar/avatar.service';
import { DialogService } from 'src/app/dialog/dialog.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  host: {
    class: "app-account"
  }
})
export class AccountComponent implements OnInit, AfterViewInit {

  user: User

  pictoFile: File | string | ArrayBuffer

  changed: boolean = false

  formGroup: FormGroup

  avatarData: { type: AvatarType, name: string }[] = [
    { type: "female", name: "Féminin" },
    { type: "male", name: "Masculin" },
    { type: "avataaars", name: "Custom" },
    { type: "bottts", name: "Robot" },
    { type: "gridy", name: "Gridy" }
  ]
  constructor(
    private api: ApiService,
    private avatar: AvatarService,
    private dialog: DialogService,
    formBuilder: FormBuilder) {

    this.user = api.user

    this.setUpFormGroup(formBuilder, api.user)
  }

  private setUpFormGroup(fb: FormBuilder, user: User) {
    const g = fb.group({
      email: [user.email, [Validators.required, Validators.email]],
      name: [user.name, [Validators.required, Validators.minLength(3)]],
      picto: [user.picto, [(control: AbstractControl): ValidationErrors | null => {

        return null
      }]]
    })

    g.valueChanges.subscribe(o=>{
      const u = this.user
      let c = false
      for (const key in o) {
        if(u[key] != o[key]) {
          c = true
          break
        }
      }
      this.changed = c
    })

    this.formGroup = g
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {


  }

  save() {

  }
}
