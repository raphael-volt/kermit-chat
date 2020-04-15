import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreadEditorComponent } from './thread-editor.component';
import { EmojiService } from './emoji-service';
import { EmojiSelectorComponent } from './emoji-selector/emoji-selector.component';
import { EmojiListComponent } from './emoji-list/emoji-list.component';


@NgModule({
  declarations: [ThreadEditorComponent, EmojiSelectorComponent, EmojiListComponent],
  imports: [
    CommonModule
  ],
  exports: [ThreadEditorComponent],
  providers: [EmojiService]
})
export class ThreadEditorModule { }
