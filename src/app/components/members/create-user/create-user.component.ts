import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/vo/vo';
import { ApiService } from 'src/app/api/api.service';
import { first } from 'rxjs/operators';
import { ContextService } from 'src/app/context.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  form: FormGroup
  constructor(
    private ref: MatDialogRef<CreateUserComponent, User>,
    private api: ApiService,
    private context: ContextService,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      email: ["", [Validators.required, Validators.email, (control: AbstractControl) => {
        const email = control.value
        if (this.emailExitst(email)) {
          return { email: true }
        }
        return null
      }]],
      name: ["", [Validators.required, Validators.minLength(3)]]
    })
  }

  emailExitst(email) {
    const user = this.context.users.find(user => user.email == email)
    return user != undefined
  }

  send() {
    const g = this.form
    const user: User = Object.assign({}, g.value)
    this.api.addUser(user).pipe(first()).subscribe(this.close)
  }

  close = (user: User = null) => {
    this.ref.close(user)
  }


}
