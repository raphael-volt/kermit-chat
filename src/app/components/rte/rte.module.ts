import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule, QuillModules } from 'ngx-quill';
import { RteComponent } from './editor/rte.component';
import { ViewComponent } from './view/view.component'
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module'
import { RTEEmojiBlot } from '../mat-emoji/quill/emoji-blot';
import { RTEEmojiToolbar } from '../mat-emoji/quill/emoji-toolbar';

Quill.register('modules/imageResize', ImageResize)
Quill.register('formats/rteemoji', RTEEmojiBlot)
Quill.register('modules/rteemoji', RTEEmojiToolbar)
/* 
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['10px', '14px', '18px', '24px', '32px']
Quill.register(Size, true)
*/

const h = {
  toolbar: {
    handlers: {
      /**
       * Fix link tooltip position
       * @param value 
       */
      link: function link(value) {
        if (value) {
          let range = this.quill.getSelection();
          if (range == null || range.length == 0) return;
          let preview = this.quill.getText(range);
          if (/^\S+@\S+\.\S+$/.test(preview) && preview.indexOf('mailto:') !== 0) {
            preview = 'mailto:' + preview;
          }
          let tooltip = this.quill.theme.tooltip;
          tooltip.boundsContainer = tooltip.quill.root
          tooltip.edit('link', preview)
        } else {
          this.quill.format('link', false);
        }
      }

    }
  }
}
const quillModules: QuillModules = {
  imageResize: {},
  rteemoji: {},
  toolbar: {
    container: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent

      [{ 'size': ['small', false, 'large', 'huge'] }, { 'align': [] }, { 'color': [] }, 'clean'],  // custom dropdown

      ['image', 'rteemoji']                         // link and image, video
    ]
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot({
      modules: quillModules
    })
  ],
  declarations: [RteComponent, ViewComponent],
  exports: [RteComponent, ViewComponent],
  providers: []
})
export class RteModule { }
