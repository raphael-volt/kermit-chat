import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ThreadComponent } from './thread/thread.component';
import { RouterModule } from '@angular/router';
import { CreateThreadComponent } from './create-thread/create-thread.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { ThreadEditorModule } from "../../thread-editor/thread-editor.module";
import { FxTextEditorModule } from 'src/app/fx-text-editor/fx-text-ediror.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ThreadEditorModule,
    FxTextEditorModule
  ],
  declarations: [MessagesComponent, ThreadComponent, CreateThreadComponent, TextEditorComponent],
  exports: [MessagesComponent]
})
export class MessagesModule { }
