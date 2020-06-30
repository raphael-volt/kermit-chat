import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'material';
import { ThreadComponent } from './thread/thread.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MessagesComponent } from './messages.component';
import { CreateThreadComponent } from './create-thread/create-thread.component';
import { UserPreviewModule } from '../user-preview/user-preview.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ThreadReadByBadgeComponent } from './thread/thread-read-by-badge/thread-read-by-badge.component';
import { MatRteModule } from 'mat-rte';
import { ReplyDialogComponent } from './reply-dialog/reply-dialog.component';
@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    UserPreviewModule,
    ScrollingModule,
    MatRteModule
  ],
  declarations: [MessagesComponent, ThreadComponent, CreateThreadComponent, ThreadReadByBadgeComponent, ReplyDialogComponent],
  exports: [MessagesComponent, ReplyDialogComponent]
})
export class MessagesModule { }
