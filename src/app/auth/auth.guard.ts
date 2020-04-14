import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { DialogService } from '../dialog/dialog.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private dialogService: DialogService) {
        const e = "" + "zz"
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const service = this.authService
        if (service.authorized)
            return true
        return new Observable<boolean>((observer: Observer<boolean>) => {
            const openDialog = () => {
                const sub = this.dialogService.openSignin().subscribe(user => {
                    sub.unsubscribe()
                    observer.next(true)
                })
            }
            if (!service.hasCookie) {
                openDialog()
            }
            else {
                let sub: Subscription
                const done = () => {
                    if (sub && !sub.closed)
                        sub.unsubscribe()
                }
                service.loadCookie()
                sub = this.authService.init().subscribe(
                    success => {
                        done()
                        if (success)
                            observer.next(true)
                        else
                            openDialog()
                    },
                    error => {
                        done()
                        openDialog()
                    })
            }
        })
    }


}