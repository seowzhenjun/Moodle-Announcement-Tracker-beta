import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

import { GmailhttpService } from './gmailhttp.service';
import { CloudFunctionService } from './cloud-function.service';

declare var window;

@Injectable()
export class AuthService {
  isLoggedIn = false;
  firstLogin = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(
    private router : Router,
    private _http : GmailhttpService,
    private _cf : CloudFunctionService
  ){}

  logout(): void {
    window.plugins.googleplus.disconnect( 
      (msg)=> console.log(msg)
    );
    let obj = JSON.parse(window.localStorage.getItem('obj'));
    this._cf.unsubscribe(obj.email,obj.regToken).subscribe();
    window.localStorage.setItem('showTutorial','true');
    window.localStorage.removeItem('obj');
    window.localStorage.removeItem('email');
    window.localStorage.removeItem('historyId');
    window.localStorage.removeItem('nextPageToken');
    this.router.navigate(['/login'],{replaceUrl:true});
  }
}