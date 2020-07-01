import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-prompt-delete-user',
  templateUrl: './prompt-delete-user.component.html'
})
export class PromptDeleteUserComponent {

  constructor(public ref: MatDialogRef<PromptDeleteUserComponent>) { }

}