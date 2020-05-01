import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'material';
import { ThreadComponent } from './thread/thread.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RteModule } from '../rte/rte.module';

import { MessagesComponent } from './messages.component';
import { CreateThreadComponent } from './create-thread/create-thread.component';
import { UserPreviewModule } from '../user-preview/user-preview.module';
// import { CdkVirtualForOf } from '@angular/cdk/scrolling';
import {ScrollingModule} from '@angular/cdk/scrolling';
@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    RteModule,
    UserPreviewModule,
    ScrollingModule,
  ],
  declarations: [MessagesComponent, ThreadComponent, CreateThreadComponent],
  exports: [MessagesComponent]
})
export class MessagesModule { }
