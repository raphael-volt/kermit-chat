import { Component, isDevMode } from '@angular/core';
import { routes } from "./app-routing.module";
import { Routes, Route, Router, ActivationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatAvatarsService } from 'mat-avatars';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  routes: Routes 
  activeLink: Route

  private routerSub: Subscription

  constructor(private router: Router, private avtService: MatAvatarsService) { 
    const isDev = isDevMode()
    this.routes = routes.filter(route=>{
      if(!isDev && route.path == "debug-rte")
        return false
      return route.path != '' && route.title != "none"
    })
  }

  private worker: Worker

  ngOnInit(): void {
    this.routerSub = this.router.events.subscribe(this.handleRouteActivation)
  }
  ngOnDestroy() {
    this.worker.terminate()
    if (this.routerSub)
      this.routerSub.unsubscribe()
  }

  private handleRouteActivation = (event: any) => {
    if (event instanceof ActivationEnd) {

      const path = event.snapshot.routeConfig.path
      let route: Route = this.routes.find(route => route.path == path)
      if (!route)
        route = routes[0]
      this.activeLink = route
    }
  }

}
