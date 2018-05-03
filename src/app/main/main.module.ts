import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { MainRoutingModule} from './main-routing.module';

import { SharedModule }         from '../shared.module';
import { MainComponent }        from './main.component';
import { SidebarComponent }     from './sidebar/sidebar.component';
import { TableComponent }       from './table/table.component';
import { TopbarComponent }      from './topbar/topbar.component';
import { EmailDetailComponent } from './email-detail/email-detail.component';
import { SafeHtmlPipe }         from './email-detail/email-detail.component';

import { DataService }          from './data.service';

import { WelcomeDialogComponent } from './welcome-dialog/welcome-dialog.component';
import { DialogComponent }      from './dialog/dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    MainRoutingModule
  ],
  declarations: [
    MainComponent,
    SidebarComponent,
    TableComponent,
    TopbarComponent,
    EmailDetailComponent,
    DialogComponent,
    WelcomeDialogComponent,
    SafeHtmlPipe
  ],
  providers: [
    DataService
  ],
  entryComponents: [
    DialogComponent,
    WelcomeDialogComponent
  ]
})
export class MainModule {}