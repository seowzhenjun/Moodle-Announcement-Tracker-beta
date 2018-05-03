import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import 'hammerjs';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './login/login.module';
import { MainModule } from './main/main.module';
import { SharedModule } from './shared.module';
import { PageNotFoundComponent} from './pageNotFound/pageNotFound.component';

import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { CloudFunctionService } from './services/cloud-function.service';
import { DateService } from './services/date.service';
import { GmailhttpService } from './services/gmailhttp.service';
import { KeywordSuggestionsService } from './services/keyword-suggestions.service';
import { PasswordService } from './services/password.service';
import { oAuth2Service } from './services/oAuth2.service';
import { ReadDBService } from './services/read-db.service';
import { WriteDBService } from './services/write-db.service';
import { UserInfoService } from './services/user-info.service';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserAnimationsModule,
    SharedModule,
    MainModule,
    LoginModule,
    AppRoutingModule
  ],
  exports: [],
  providers: [
    AuthGuard,
    AuthService,
    CloudFunctionService,
    DateService,
    GmailhttpService,
    KeywordSuggestionsService,
    oAuth2Service,
    PasswordService,
    ReadDBService,
    WriteDBService,
    UserInfoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
