import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';
import { UrlService } from "./url.service";
import { AuthModule } from '../auth/auth.module';
import { BusyService } from './busy.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddHeaderInterceptor } from './add-header.interceptor';
import { HttpClientModule } from "@angular/common/http";
import { DEFAULT_API_CONFIG, ApiConfig } from './api-config';
import { ImagePipe } from './image.pipe';
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
  providers: [ApiService, BusyService, httpInterceptorProviders,
  {
    provide: UrlService,
    useFactory: () => {
      return new UrlService(DEFAULT_API_CONFIG)
    }
  }]
})
export class ApiModule { }
