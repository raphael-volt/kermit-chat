import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { ThreadComponent } from './thread/thread.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RteModule } from '../rte/rte.module';

import { MessagesComponent } from './messages.component';
import { CreateThreadComponent } from './create-thread/create-thread.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    RteModule
  ],
  declarations: [MessagesComponent, ThreadComponent, CreateThreadComponent],
  exports: [MessagesComponent]
})
export class MessagesModule { }
