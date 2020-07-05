import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersComponent } from './members/members.component';
import { AccountComponent } from './account/account.component';
import { MaterialModule } from 'material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MessagesModule } from './messages/messages.module';

import { ApiModule } from '../api/api.module';
import { PictoEditorComponent } from './picto-editor/picto-editor.component';
import { PictoViewComponent } from './picto-view/picto-view.component';
import { ImgScrollerModule } from '../img-scroller/img-scroller.module';
import { UserPreviewModule } from "./user-preview/user-preview.module";
import { DebugRteComponent, CDKDataDialog } from "./debug-rte/debug-rte.component";
import { SnackBarUserOnComponent } from './snack-bar-user-on/snack-bar-user-on.component';
import { CreateUserComponent } from './members/create-user/create-user.component';
import { MatRteModule } from "mat-rte";
import { MatAvatarsModule } from "mat-avatars";
import { PromptDeleteUserComponent } from './members/prompt-delete-user/prompt-delete-user.component';
@NgModule({
  declarations: [
    MembersComponent,
    AccountComponent,
    PictoEditorComponent,
    PictoViewComponent,
    SnackBarUserOnComponent,
    CreateUserComponent,
    PromptDeleteUserComponent,
    DebugRteComponent, CDKDataDialog
  ],
  imports: [
    ApiModule,
    MessagesModule,
    UserPreviewModule,
    CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, ImgScrollerModule,
    MatAvatarsModule, MatRteModule
  ],
  exports: [
    MessagesModule, MembersComponent, AccountComponent,
    PictoViewComponent, PictoEditorComponent, 
    SnackBarUserOnComponent,
    CreateUserComponent,
    DebugRteComponent, CDKDataDialog
  ]
})
export class ComponentsModule { }
