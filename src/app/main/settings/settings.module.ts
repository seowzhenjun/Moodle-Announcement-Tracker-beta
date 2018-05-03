import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';

import { SharedModule }         from '../../shared.module';
import { SettingsComponent }    from './settings.component';

import { SettingsRoutingModule} from './settings-routing.module';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule
  ],
  declarations: [
    SettingsComponent,
    GeneralSettingsComponent
  ],
  providers: []
})
export class SettingsModule {}