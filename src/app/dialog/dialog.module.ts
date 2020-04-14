import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PanelComponent, PanelContentDirective,
  PanelFooterDirective, PanelHeaderDirective,
  FooterSpacer, PanelCloseButton
} from './panel/panel.component';
import { SigninComponent } from './signin/signin.component';
import { DialogService } from './dialog.service';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    PanelComponent, PanelContentDirective,
    PanelFooterDirective, PanelHeaderDirective,
    FooterSpacer, PanelCloseButton, SigninComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    PanelComponent, PanelContentDirective,
    PanelFooterDirective, PanelHeaderDirective,
    FooterSpacer, PanelCloseButton, SigninComponent],
  providers: [DialogService]
})
export class DialogModule { }
