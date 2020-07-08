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
import { ImgScrollerModule } from "./img-scroller/img-scroller.module";
import { ContextService } from './context.service';
import { MatAvatarsModule } from 'mat-avatars';
import { MatRteModule } from 'mat-rte';
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
    ImgScrollerModule,
    MatAvatarsModule.forRoot(),
    MatRteModule.forRoot({
      emoji: {
        sheetSize: 64,
        set: "apple"
      },
      quill: {
        toolbarSizes: [
            { size: "14px", name: "normal" },
            { size: "21px", name: "moyen 1" },
            { size: "28px", name: "moyen 2" },
            { size: "38px", name: "grand" },
            { size: "48px", name: "XXL" }
        ]
    }
    }),
  ],
  providers: [ContextService],
  bootstrap: [AppComponent]
})
export class AppModule { }
