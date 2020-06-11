import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/vo/vo';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {

  form: FormGroup

  constructor(
    private dialogRef: MatDialogRef<SigninComponent>,
    private authService: AuthService,
    private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  countError: number = 0
  signinError: boolean = false
  send() {
    this.signinError = false
    const user: User = { email: this.form.get("email").value }
    this.authService.signin(user.email).subscribe(done => {
      if(done)
        this.dialogRef.close(user)
      else {
        this.countError ++
        this.signinError = true
      }
    },
      error => {
        this.signinError = true
      })
  }
}
