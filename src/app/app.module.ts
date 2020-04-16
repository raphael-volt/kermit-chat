import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from "@angular/flex-layout";

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ApiModule } from './api/api.module';
import { MaterialModule } from './material/material.module';
import { DialogModule } from './dialog/dialog.module';
import { ComponentsModule } from './components/components.module';
import { FxTextEditorModule } from "./fx-text-editor/fx-text-ediror.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ApiModule,
    DialogModule,
    ComponentsModule,
    FlexLayoutModule,
    FxTextEditorModule
  ],
  exports: [
    MaterialModule,
    ApiModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
