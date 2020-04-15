import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersComponent } from './members/members.component';
import { AccountComponent } from './account/account.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from './messages/messages.module';



@NgModule({
  declarations: [MembersComponent, AccountComponent],
  imports: [
    MessagesModule,
    CommonModule, MaterialModule, FormsModule, ReactiveFormsModule
  ],
  exports: [
    MessagesModule, MembersComponent, AccountComponent
  ]
})
export class ComponentsModule { }
