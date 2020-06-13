import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { DialogService } from '../dialog/dialog.service';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(
        private authService: AuthService,
        private dialogService: DialogService) { }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (childRoute.parent) {
            //const c : MessagesComponent = childRoute.parent.component as MessagesComponent
        }
        return this.canActivate(childRoute, state)
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        const service = this.authService
        if (service.authorized)
            return true
        return new Observable<boolean>((observer: Observer<boolean>) => {
            const signin = () => {
                observer.next(true)
            }
            const openDialog = () => {
                const sub = this.dialogService.openSignin().subscribe(user => {
                    sub.unsubscribe()
                    signin()
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
                            signin()
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