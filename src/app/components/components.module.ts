import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages/messages.component';
import { MembersComponent } from './members/members.component';
import { AccountComponent } from './account/account.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [MessagesComponent, MembersComponent, AccountComponent],
  imports: [
    CommonModule, MaterialModule
  ],
  exports: [
    MessagesComponent, MembersComponent, AccountComponent
  ]
})
export class ComponentsModule { }
