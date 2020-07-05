import { NgModule, ModuleWithProviders } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";

import { ImageResizeComponent } from './mat-image/image-resize/image-resize.component';
import { MatRteComponent } from './mat-rte.component';
import { MatRteViewDirective } from './mat-rte-view.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { EmojiDialogPickerComponent } from './quill-emoji-mart/emoji-dialog-picker/emoji-dialog-picker.component';
import { EmojiPickerComponent } from './quill-emoji-mart/emoji-picker.component';
import { MartEmojiDirective } from './quill-emoji-mart/mart-emoji.directive';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiPickerService } from './quill-emoji-mart/emoji-picker.service';
import { MAT_RTE_CONFIG_TOKEN, DEFAULT_MAT_RTE_CONFIG, MatRteConfig } from './mart-emoji.config';
import { QLDownloadTooltip } from './quill-download/tooltip/tooltip.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PortalModule } from '@angular/cdk/portal';
import { QuillService } from './quill.service';
import { DownloadService } from './quill-download/download.service';

@NgModule({
  declarations: [
    MatRteComponent,
    MatRteViewDirective,
    ImageResizeComponent,
    EmojiDialogPickerComponent, EmojiPickerComponent,
    MartEmojiDirective,
    QLDownloadTooltip
  ],
  imports: [
    OverlayModule,
    PortalModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    PickerModule,
    MatTooltipModule
  ],
  providers: [EmojiPickerService, QuillService, DownloadService],
  exports: [
    MatRteComponent, MatRteViewDirective,
    EmojiDialogPickerComponent, EmojiPickerComponent,
    MartEmojiDirective, QLDownloadTooltip
  ]
})
export class MatRteModule {
  static forRoot(config: MatRteConfig = null): ModuleWithProviders<MatRteModule> {
    return {
      ngModule: MatRteModule,
      providers: [
        {
          useValue: config || DEFAULT_MAT_RTE_CONFIG,
          provide: MAT_RTE_CONFIG_TOKEN
        }
      ]
    }
  }
}
