import { NgModule } from '@angular/core';
import { EmojiListComponent } from './emoji-list/emoji-list.component';
import { MaterialModule } from 'material';
import { MatEmojiService } from './mat-emoji.service';
import { EmojiSelectComponent } from './emoji-select/emoji-select.component';
import { ListSliderDirective } from './emoji-select/list-slider.directive';
import { MatEmojiDirective } from './mat-emoji.directtive';
import { MatFontIconDirective } from "./mat-font-icon.directive";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [
    EmojiListComponent,
    EmojiSelectComponent,
    ListSliderDirective,
    MatEmojiDirective,
    MatFontIconDirective
  ],
  exports: [
    EmojiListComponent,
    EmojiSelectComponent,
    MatEmojiDirective
  ],
  providers: [MatEmojiService]
})
export class MatEmojiModule { }
