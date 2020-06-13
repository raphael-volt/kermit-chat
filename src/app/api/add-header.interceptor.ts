import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { BusyService } from './busy.service';
import { catchError, map, first } from 'rxjs/operators';
import { DialogService } from '../dialog/dialog.service';
import { ResponseError } from '../vo/vo';
@Injectable({
    providedIn: 'root'
})
export class AddHeaderInterceptor implements HttpInterceptor {

    private hasError = false
    private errors: string[][] = []

    constructor(
        private authService: AuthService,
        private buzy: BusyService,
        private dialog: DialogService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request to add the new header
        const clonedRequest = req.clone(
            {
                headers: req.headers.set('Jp-Auth', this.authService.getAuthData())
            })
        const showBuzy = req.url.search("watch") < 0
        if (showBuzy) this.buzy.open()
        // Pass the cloned request instead of the original request to the next handle
        return next.handle(clonedRequest).pipe(
            map((response: HttpResponse<any>) => {
                if (response.type > 0 && showBuzy) {
                    if (this.authService.authorized) {
                        const body = response.body
                        if (body != null && typeof body == "object" && "error" in body)
                            this.registerError(body)
                    }
                    this.buzy.close()
                }
                return response
            }),
            catchError((error: HttpErrorResponse) => {
                // server-side error
                this.buzy.close()
                const responseError: ResponseError = {
                    error: {
                        params: req.params.toString(),
                        url: req.url
                    }
                }
                if (error.error instanceof ErrorEvent) {
                    responseError.error.code = 0
                    responseError.error.message = error.error.message
                } else {
                    responseError.error.code = error.status
                    responseError.error.message = error.message
                }
                this.registerError(responseError)
                return throwError(responseError.error.message);
            })
        )
    }

    private registerError(error: ResponseError) {
        const e = error.error
        const lines: string[] = [
            `Aïe, si tu voix ce message, peux tu essayer de le copier pour l'envoyer par email à fionnvolt@gmail.com ?`,
            `url: ${e.url}`
        ]
        if (e.params) {
            lines.push(`params: ${e.params}`)
        }
        if ("code" in e && e.code > 0) {
            lines.push(`code: ${e.code}`)
        }
        lines.push(e.message)
        this.appendError(lines)
        this.errors.push(lines)
        if (!this.hasError) {
            this.hasError = true
            this.dialog.error(...this.errors[0]).pipe(first()).subscribe((res?) => {
                this.errors.shift()
                this.hasError = this.errors.length > 0

            })
        }
    }

    private openErrorDialog() {
        this.dialog.error(...this.errors[0]).pipe(first()).subscribe((res?) => {
            this.errors.shift()
            this.hasError = this.errors.length > 0
            if (this.hasError) {
                this.openErrorDialog()
            }
        })
    }

    private appendError(lines: string[]) {
        this.errors.push(lines)
        if (!this.hasError) {
            this.hasError = true
            this.openErrorDialog()
        }
    }
}