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
const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AddHeaderInterceptor, multi: true }
]

@NgModule({
  declarations: [ImagePipe],
  imports: [
    CommonModule,
    AuthModule,
    HttpClientModule
  ],
  exports: [ImagePipe],
  providers: [
    ApiService,
    BusyService,
    UserService,
    httpInterceptorProviders,
    {
      provide: UrlService,
      useFactory: () => {
        const config = isDevMode() ? DEV_API_CONFIG : PROD_API_CONFIG
        return new UrlService(config)
      }
    }]
})
export class ApiModule { }
