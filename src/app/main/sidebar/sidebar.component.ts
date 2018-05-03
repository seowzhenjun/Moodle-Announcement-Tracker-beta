import { Component, OnInit, Input } from '@angular/core';
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
export class SidebarComponent implements OnInit {
  @Input() userDetail : any;
  
  constructor(
    private router : Router,
    private sidenav : MatSidenav,
    public authService : AuthService,
    private _cf : CloudFunctionService
  ) {}
  
  //headerImgUrl : string = this.userDetail.imageUrl;
  ngOnInit() {
  }

  inbox(){
    this.router.navigate(['/main/table']);
    this.sidenav.close();
  }

  filter(){
    this.router.navigate(['/main/filter']);
    this.sidenav.close();
  }

  settings(){
    this.router.navigate(['/main/settings']);
    this.sidenav.close();
  }

  help(){
    this.router.navigate(['/main/help']);
    this.sidenav.close();
  }

  signOut(){
    this.authService.logout();
  }
}
