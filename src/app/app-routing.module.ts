import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { MessagesComponent } from './components/messages/messages.component';
import { AccountComponent } from './components/account/account.component';
import { MembersComponent } from './components/members/members.component';
import { AuthGuard } from './auth/auth.guard';

export interface NamedRoute extends Route {
  title: string
}

const routes: NamedRoute[] = [
  {
    path: "",
    pathMatch: 'full',
    title: "Méssagerie",
    component: MessagesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "account",
    title: "Mon compte",
    component: AccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "members",
    title: "Liste des membres",
    component: MembersComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export { routes }