import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

import { AuthService } from '../../services/auth.service';
import { MatSidenav } from '@angular/material';
import { CloudFunctionService } from '../../services/cloud-function.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() userDetail : any;
  sidebarList = [
    { name : 'Inbox',             icon : 'inbox'},
    { name : 'Filter',            icon : 'filter_list'},
    { name : 'Setting',           icon : 'settings'},
    { name : 'Help and Feedback', icon : 'help'},
    { name : 'Logout',            icon : 'exit_to_app'}
  ];
  constructor(
    private router : Router,
    private sidenav : MatSidenav,
    public authService : AuthService,
    private _cf : CloudFunctionService
  ) {}

  navigate(path){
    switch(path){
      case 'Inbox':
        this.router.navigate(['/main/table']);
        this.sidenav.close();
      break;
      case 'Filter':
        this.router.navigate(['/main/filter']);
        this.sidenav.close();
      break;
      case 'Setting':
        this.router.navigate(['/main/settings']);
        this.sidenav.close();
      break;
      case 'Help and Feedback':
        this.router.navigate(['/main/help']);
        this.sidenav.close();
      break;
      case 'Logout':
        this.authService.logout();
      break;
    }

  }
}
