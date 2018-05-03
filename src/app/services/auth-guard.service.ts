import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                           from '@angular/router';
import { AuthService }      from './auth.service';
import { UserInfoService } from '../services/user-info.service';
import * as firebase from 'firebase';

declare var window;

@Injectable()
export class AuthGuard implements CanActivate {
    
  constructor(private authService: AuthService, 
              private router: Router,
              private _user : UserInfoService ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if(this.authService.isLoggedIn){return true;}
    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    let obj = window.localStorage.getItem('obj');
    if(obj){
        this.authService.firstLogin=false;
        this.authService.isLoggedIn = true;
        let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/main/table';
        // Redirect the user
        this.router.navigate([redirect],{ replaceUrl: true });
    }
    else {
      // User is signed out.
      // Navigate to the login page with extras
      this.router.navigate(['/login']);
      return false;
    }
  }
}