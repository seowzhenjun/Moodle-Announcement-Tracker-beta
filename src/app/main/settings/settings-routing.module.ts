import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent}     from './settings.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';

const mainRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component : SettingsComponent
      },
      {
        path : 'generalSettings',
        component : GeneralSettingsComponent
      }
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
export class SettingsRoutingModule { }