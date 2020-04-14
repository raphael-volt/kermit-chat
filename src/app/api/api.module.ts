import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';
import { AuthModule } from '../auth/auth.module';
import { BusyService } from './busy.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddHeaderInterceptor } from './add-header.interceptor';
import { HttpClientModule } from "@angular/common/http";
const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AddHeaderInterceptor, multi: true }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthModule,
    HttpClientModule
  ],
  providers: [ApiService, BusyService, httpInterceptorProviders]
})
export class ApiModule { }
