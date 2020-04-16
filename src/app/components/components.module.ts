import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersComponent } from './members/members.component';
import { AccountComponent } from './account/account.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from './messages/messages.module';

import { FxTextEditorModule } from "../fx-text-editor/fx-text-ediror.module";
import { EditorComponent } from './editor/editor.component';

@NgModule({
  declarations: [MembersComponent, AccountComponent, EditorComponent],
  imports: [
    MessagesModule,
    CommonModule, MaterialModule, FormsModule, ReactiveFormsModule,
    FxTextEditorModule
  ],
  exports: [
    MessagesModule, MembersComponent, AccountComponent
  ]
})
export class ComponentsModule { }
