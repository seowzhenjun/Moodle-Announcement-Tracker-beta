import { Component } from '@angular/core';
import * as firebase from 'firebase';
//import { MatSidenav } from '@angular/material';
import { Router, NavigationStart } from '@angular/router';
import { DataService } from './data.service';
import { ReadDBService } from '../services/read-db.service';
import { AuthService } from '../services/auth.service';
import { GmailhttpService } from '../services/gmailhttp.service';

declare var window;
declare var navigator;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent{

  userdetail : any = {};
  
  constructor( 
    public _service : DataService,
    private router : Router,
    private auth : AuthService,
    private _db : ReadDBService,
    private _http: GmailhttpService
    //private sidenav : MatSidenav
  ) {}

  ngOnInit() {
    let obj = JSON.parse(window.localStorage.getItem('obj'));
    if(navigator.connection.type !== "none" && !this.auth.firstLogin){
      this._db.getAccessToken(obj.email);
    }

    if(obj !== ""){
      this.userdetail = obj;
    }

    document.addEventListener('deviceready',()=>{
      document.addEventListener('offline',()=>{
        this._service.disconnect = true;
      },false);
      document.addEventListener("online", ()=>{
        this._db.getAccessToken(obj.email);
        this._service.disconnect = false;
      }, false);
      window.FirebasePlugin.onNotificationOpen(
        notification=> {
          if(notification.tap === false){
            let obj = JSON.parse(window.localStorage.getItem('obj'));
            this._http.getMsg(obj.email,notification.id,obj.accessToken).subscribe(
              msg => {
                this._db.getEmailDetail([msg],false);
              }
            );
          }
        }, error=> {
          console.error(error);
      });
    },false);

    this.router.events.subscribe((e)=>{
      if(e instanceof NavigationStart){
        switch(e.url){
          case '/main/table':
            this._service.title = 'Inbox';
            break;
          case '/main/filter':
            this._service.title = 'Filter';
            break;
          case '/main/settings':
            this._service.title = 'Settings';
            break;
          case '/main/help':
            this._service.title = 'Help';
            break;
          case '/main/gettingStarted':
            this._service.title = 'Getting Started';
            break;
          case '/main/help/feedback':
            this._service.title = 'Feedback';
            break;
          case '/main/filter/keywordSuggest':
            this._service.title = 'Keyword Suggestion';
            break;
          case '/main/filter/currentFilter':
            this._service.title = 'My Filter';
            break;
          default:
            break;
        }
      }
    });
  }

  // onChange($event){
  //   console.log($event);
  //   if($event == true){
  //     document.addEventListener("deviceready", ()=>{
  //       document.addEventListener("backbutton", ()=>{
  //         window.history.back();
  //         //this.sidenav.close();
  //       }, false);
  //     }, false);
  //   }
  //   else{
  //     //document.removeEventListener("backbutton", ()=>{},false);
  //   }
  // }
}