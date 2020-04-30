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
import { UserPreviewComponent } from './user-preview/user-preview.component';
import { UserPictoPipe } from './user-preview/user-picto.pipe';
import { ImgScrollerModule } from '../img-scroller/img-scroller.module';

@NgModule({
  declarations: [MembersComponent, AccountComponent, EditorComponent, PictoEditorComponent, PictoViewComponent, UserPreviewComponent, UserPictoPipe],
  imports: [
    ApiModule, AvatarModule, 
    MessagesModule, RteModule,
    CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, ImgScrollerModule,
  ],
  exports: [
    MessagesModule, MembersComponent, AccountComponent, EditorComponent, 
    PictoViewComponent, PictoEditorComponent,
    UserPreviewComponent
  ]
})
export class ComponentsModule { }
