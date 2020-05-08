import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersComponent } from './members/members.component';
import { AccountComponent } from './account/account.component';
import { MaterialModule } from 'material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MessagesModule } from './messages/messages.module';
import { AvatarModule } from "../avatar/avatar.module";

import { EditorComponent } from './editor/editor.component';
import { RteModule } from './rte/rte.module';
import { ApiModule } from '../api/api.module';
import { PictoEditorComponent } from './picto-editor/picto-editor.component';
import { PictoViewComponent } from './picto-view/picto-view.component';
import { ImgScrollerModule } from '../img-scroller/img-scroller.module';
import { UserPreviewModule } from "./user-preview/user-preview.module";
import { QrteModule } from 'qrte';
@NgModule({
  declarations: [MembersComponent, AccountComponent, EditorComponent, PictoEditorComponent, PictoViewComponent],
  imports: [
    ApiModule, AvatarModule, 
    MessagesModule, RteModule,
    UserPreviewModule,
    QrteModule,
    CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, ImgScrollerModule,
  ],
  exports: [
    MessagesModule, MembersComponent, AccountComponent, EditorComponent, 
    PictoViewComponent, PictoEditorComponent
  ]
})
export class ComponentsModule { }
