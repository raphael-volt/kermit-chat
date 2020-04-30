import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefreshListDirective } from './refresh-list.directive';
import { AvatarListComponent } from './list/avatar-list.component';
import { MaterialModule } from 'material';
import { AvatarService } from './avatar.service';
import { AvatarSvgDirective } from "./avatar-svg.directive";
import { AvatarItemDirective } from './avatar-item.directive';
import { ImageModule } from '../image/image.module';
@NgModule({
  declarations: [RefreshListDirective, AvatarListComponent, 
    AvatarSvgDirective, RefreshListDirective, AvatarItemDirective],
  imports: [
    CommonModule, MaterialModule, ImageModule
  ],
  exports: [RefreshListDirective, AvatarListComponent],
  providers: [AvatarService]
})
export class AvatarModule { }
