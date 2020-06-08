import { NgModule } from '@angular/core';
import { RouterModule, Route, Routes } from '@angular/router';
import { MessagesComponent } from './components/messages/messages.component';
import { AccountComponent } from './components/account/account.component';
import { MembersComponent } from './components/members/members.component';
import { AuthGuard } from './auth/auth.guard';
import { ThreadComponent } from './components/messages/thread/thread.component';
import { DebugEmojiComponent } from './components/debug-emoji/debug-emoji.component';

export interface NamedRoute extends Route {
  title: string
}

const routes: NamedRoute[] = [
  
  {
    path: '',
    title: "default",
    pathMatch: 'full',
    redirectTo: 'messages'
  },
  {
    path: "messages",
    title: "Méssagerie",
    component: MessagesComponent,
    canActivateChild: [AuthGuard],
    canActivate: [AuthGuard],
    children: [
      {
        path: ":id",
        component: ThreadComponent
      }
    ]
  },
  {
    path: "account",
    title: "Mon compte",
    canActivate: [AuthGuard],
    component: AccountComponent
  },
  {
    path: "members",
    title: "Liste des membres",
    canActivate: [AuthGuard],
    component: MembersComponent
  },
  {
    path: '**',
    title: "none",
    redirectTo: 'messages'
  }
  /*,
  {
    path: "emoji",
    title: "RTE debug",
    canActivate: [AuthGuard],
    component: DebugEmojiComponent
  }*/
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export { routes }