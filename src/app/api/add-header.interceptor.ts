import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { BusyService } from './busy.service';
import { catchError, map } from 'rxjs/operators';
import { DialogService } from '../dialog/dialog.service';
@Injectable({
    providedIn: 'root'
})
export class AddHeaderInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private buzy: BusyService, private dialog: DialogService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request to add the new header
        const clonedRequest = req.clone(
            {
                headers: req.headers.set('JP-Auth', this.authService.getAuthData())
            })
        const showBuzy = req.url.search("watch") < 0
        if(showBuzy) this.buzy.open()
        // Pass the cloned request instead of the original request to the next handle
        return next.handle(clonedRequest).pipe(
            map(response => {
                if(response.type > 0 && showBuzy)
                    this.buzy.close()
                return response
            }),
            catchError((error: HttpErrorResponse) => {
                this.buzy.close()
                let errorMessage = `Error`;
                if (error.error instanceof ErrorEvent) {
                    // client-side error
                    errorMessage = `Error: ${error.error.message}`;
                } else {
                    // server-side error
                    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                }
                this.dialog.error(`Aïe, si tu voix ce message, peux tu essayer de le copier pour l'envoyer par email à fionvolt@gmail.com ?`, req.url, errorMessage);
                return throwError(errorMessage);
            })
        );
    }
}