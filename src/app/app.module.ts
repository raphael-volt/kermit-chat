import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { RouterModule } from '@angular/router';
import { DialogModule } from './dialog/dialog.module';
import { MaterialModule } from 'material';
import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import { AvatarModule } from './avatar/avatar.module';
import { ImgScrollerModule } from "./img-scroller/img-scroller.module";
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ComponentsModule,
    DialogModule,
    MaterialModule,
    ApiModule,
    AuthModule,
    AvatarModule,
    ImgScrollerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
