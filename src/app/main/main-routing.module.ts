import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard }            from '../services/auth-guard.service';
import { MainComponent }        from './main.component';
import { EmailDetailComponent } from './email-detail/email-detail.component';
import { TableComponent }       from './table/table.component';
import { PageNotFoundComponent }from '../pageNotFound/pageNotFound.component';

const mainRoutes: Routes = [
  {
    path: 'main',  
    component: MainComponent,
    canActivate: [AuthGuard],
    children : [
      {
        path: 'table',
        component : TableComponent,
        data : {
          title : 'My Inbox'
        }
      },
      {
        path: 'filter',
        loadChildren : 'app/main/filter/filter.module#FilterModule'
      },
      {
        path: 'settings',
        loadChildren : 'app/main/settings/settings.module#SettingsModule'
      },
      {
        path: 'help',
        loadChildren : 'app/main/help/help.module#HelpModule'
      },
      { 
        path: ':id', 
        component: EmailDetailComponent
      },
      { path: '**', component: PageNotFoundComponent }
    ] 
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(mainRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MainRoutingModule { }