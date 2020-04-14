import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
@Injectable({
    providedIn: 'root'
})
export class AddHeaderInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request to add the new header
        const clonedRequest = req.clone(
            { 
                headers: req.headers.set('JP-Auth', this.authService.getAuthData()) 
            })

        // Pass the cloned request instead of the original request to the next handle
        return next.handle(clonedRequest);
    }
}