import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefreshListDirective } from './refresh-list.directive';
import { AvatarListComponent } from './list/avatar-list.component';
import { MaterialModule } from '../material/material.module';
import { AvatarService } from './avatar.service';
import { AvatarSvgDirective } from "./avatar-svg.directive";
import { AvatarItemDirective } from './avatar-item.directive';
@NgModule({
  declarations: [RefreshListDirective, AvatarListComponent, 
    AvatarSvgDirective, RefreshListDirective, AvatarItemDirective],
  imports: [
    CommonModule, MaterialModule
  ],
  exports: [RefreshListDirective, AvatarListComponent],
  providers: [AvatarService]
})
export class AvatarModule { }
