import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersComponent } from './members/members.component';
import { AccountComponent } from './account/account.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MessagesModule } from './messages/messages.module';

import { EditorComponent } from './editor/editor.component';
import { RteModule } from './rte/rte.module';

@NgModule({
  declarations: [MembersComponent, AccountComponent, EditorComponent],
  imports: [
    MessagesModule, RteModule,
    CommonModule, MaterialModule, FormsModule, ReactiveFormsModule
  ],
  exports: [
    MessagesModule, MembersComponent, AccountComponent, EditorComponent
  ]
})
export class ComponentsModule { }
