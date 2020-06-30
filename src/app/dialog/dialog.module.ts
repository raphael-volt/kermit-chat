import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PanelComponent, PanelContentDirective,
  PanelFooterDirective, PanelHeaderDirective,
  FooterSpacer, PanelCloseButton
} from './panel/panel.component';
import { SigninComponent } from './signin/signin.component';
import { DialogService } from './dialog.service';
import { MaterialModule } from 'material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogCardComponent } from './dialog-card/dialog-card.component';
import { ImgScrollerModule } from '../img-scroller/img-scroller.module';

@NgModule({
  declarations: [
    PanelComponent, PanelContentDirective,
    PanelFooterDirective, PanelHeaderDirective,
    FooterSpacer, PanelCloseButton, SigninComponent, DialogCardComponent,
    ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ImgScrollerModule
  ],
  exports: [
    PanelComponent, PanelContentDirective,
    PanelFooterDirective, PanelHeaderDirective,
    FooterSpacer, PanelCloseButton, SigninComponent],
  providers: [DialogService]
})
export class DialogModule { }
