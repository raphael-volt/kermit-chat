import { NgModule, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';
import { UrlService } from "./url.service";
import { AuthModule } from '../auth/auth.module';
import { BusyService } from './busy.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddHeaderInterceptor } from './add-header.interceptor';
import { HttpClientModule } from "@angular/common/http";
import { DEV_API_CONFIG, PROD_API_CONFIG } from './api-config';
import { ImagePipe } from './image.pipe';
import { UserService } from './user.service';
import { WatchService } from './watch.service';
import { WatchNotificationDirective } from './watch-notification.directive';
import { WatchNotificationService } from './watch-notification.service';

const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AddHeaderInterceptor, multi: true }
]

@NgModule({
  declarations: [ImagePipe, WatchNotificationDirective],
  imports: [
    CommonModule,
    AuthModule,
    HttpClientModule
  ],
  exports: [ImagePipe, WatchNotificationDirective],
  providers: [
    ApiService,
    BusyService,
    UserService,
    WatchService,
    WatchNotificationService,
    httpInterceptorProviders,
    {
      provide: UrlService,
      useFactory: () => {
        //const config = isDevMode() ? DEV_API_CONFIG : PROD_API_CONFIG
        const config = PROD_API_CONFIG
        return new UrlService(config)
      }
    }]
})
export class ApiModule { }
