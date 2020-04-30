import { NgModule } from '@angular/core';
import { ImgScrollerComponent } from './img-scroller.component';
import { ImgSourceDirective } from './img-source.directive';



@NgModule({
  declarations: [ImgScrollerComponent, ImgSourceDirective],
  imports: [
  ],
  exports: [ImgScrollerComponent]
})
export class ImgScrollerModule { }
