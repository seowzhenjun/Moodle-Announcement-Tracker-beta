import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart } from '@angular/router';
import { NgClass } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { GmailhttpService } from '../../services/gmailhttp.service';
import { DataService } from '../data.service';
import { DateService } from '../../services/date.service';
import { ReadDBService } from '../../services/read-db.service';
import { WelcomeDialogComponent } from '../welcome-dialog/welcome-dialog.component';

declare var window;

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {

  scrollTop           : number;
  fetch               : boolean = true;
  list                : any ;
  currentIndex        : number[] = [-1];
  highlightedElement  : emailList[] = []; 
  isHighlight         : boolean ;
  showImportantEmail  : boolean;
  event               : any ;
  welcomeDialogRef    : MatDialogRef<WelcomeDialogComponent>;
  disconnect          : boolean ;

  constructor(
    private router      : Router,
    public _service     : DataService,
    private _date       : DateService,
    private _http       : GmailhttpService,
    private _db         : ReadDBService,
    private dialog      : MatDialog) {}

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true); //third parameter
    this._service.updateView.subscribe(
      view => {
        if(view){
          this.updateView();
        }
      });

    this._service.isHighlight.subscribe(
      isHighlight=>{
        if(!isHighlight){
          this.currentIndex = [-1];
          this.highlightedElement=[];
        }
      this.isHighlight=isHighlight;
      }
    );

    this._service.currentEmailList.subscribe(
      list=>{
        this.list=this.checkUnread(list);
      }
    );
    
    let obj = JSON.parse(window.localStorage.getItem('obj'));
    if(obj !== ""){
      // Use email from local storage if any
      let localStorageEmail = window.localStorage.getItem('email');
      if(localStorageEmail !== null){
        this.list = this.checkUnread(JSON.parse(localStorageEmail));
      }
      else{
        this.listMsg();
      }
    }
  }
  
  ngAfterViewInit(){
    if(this.event){
      console.log(this.event);
      this.event.srcElement.scrollTop = this.scrollTop;
    }

    if(window.localStorage.getItem('showTutorial') === 'true'){
      window.localStorage.setItem('showTutorial','false');
      this.welcomeDialogRef = this.dialog.open(WelcomeDialogComponent, {
        autoFocus: false,
        width : '90vw'
      });
    }
  }

  listMsg(nextPageToken?){
    let obj = JSON.parse(window.localStorage.getItem('obj'));
    if(!nextPageToken){
      nextPageToken = null;
    }
    this._http.listMsg(obj.email,obj.accessToken,30,nextPageToken)
    .subscribe(
      result => {
        this.getMsg(obj, result);
      },
      err => console.log(err)
    );
  }
  
  getMsg(obj, result){
    var promiseArr = [];
    for(let key in result){
      if(key === "nextPageToken"){
        window.localStorage.setItem('nextPageToken',result[key]);
      }
      if(key === "messages"){
        for(var i=0; i< result[key].length; i++){
          promiseArr[i] = new Promise ((resolve) =>{
              this._http.getMsg(obj.email,result[key][i].id,obj.accessToken)
              .subscribe(
              result => resolve(result),
              err => console.log(err)
            );
          })
        }
        Promise.all(promiseArr).then(val => {
          let msgArr = this.sortMsg(val);
          this._db.getEmailDetail(msgArr,true);
          this.fetch = true;
        });
      }
    };
  }

  sortMsg(msgArr){
    let swap : boolean = true;
    let temp;
    while(swap){
    swap = false;
      for (var i = 0 ; i < msgArr.length-1; i ++){
          if (msgArr[i].internalDate<msgArr[i+1].internalDate){
              temp = msgArr[i+1];
              msgArr[i+1] = msgArr[i];
              msgArr[i] = temp;
              swap = true;
          }
      }
    }
    return msgArr;
  }

  showDetail(emailList){
    // if(this.event){
    //   console.log(this.event);
    //   this.scrollTop = this.event.srcElement.scrollTop;
    // }
    this.router.navigate(['/main', emailList.id])
    .then(() => {
      let obj = JSON.parse(window.localStorage.getItem('obj'));
      let email = JSON.parse(window.localStorage.getItem('email'));

      //this._service.sendPayload(emailList);
      this._service.payload = emailList;
      this._http.modify(emailList.id,obj.email,obj.accessToken).subscribe(
        (msg)=> {
          let temp = email.findIndex(x => x.id === emailList.id);
          let ind = email[temp].labelIds.indexOf("UNREAD");
          if(ind != -1){
            email[temp].fontWeight = 'normal';
            email[temp].opacity = '0.5';
            email[temp].labelIds.splice(ind,1);
            this._service.sendList(email);
            window.localStorage.setItem('email',JSON.stringify(email));
          }
        }
      );
    });
  }

  onContextMenu($event,i,element){
    $event.preventDefault();
    $event.stopPropagation();
    let hasHighlight : boolean ;
    let ind = this.currentIndex.findIndex(x=> x === i);
    let elementInd = this.highlightedElement.findIndex(x=> x.id === element.id);
    if(ind!==-1){
      this.currentIndex.splice(ind,1);
      this.highlightedElement.splice(elementInd,1);
    }
    else{
      this.currentIndex.push(i);
      this.highlightedElement.push(element);
    }
    hasHighlight = this.highlightedElement.length ? true : false;
    this._service.sendId(this.highlightedElement);
    this._service.sendHighlight(hasHighlight);
    this._service.sendFilterList(false);
  }

  updateView(){
    let email = JSON.parse(window.localStorage.getItem('email'));
    this.list = this.checkUnread(email);
  }

  checkUnread(list){
    for(var i=0; i<list.length; i++){
      for(var j=0; j<list[i].labelIds.length; j++){
        if(list[i].labelIds[j]=='UNREAD'){
          list[i].fontWeight = 'bold';
          list[i].opacity = 1;
        }
      }
      list[i].date = this._date.convertDate(list[i].internalDate);
    }
    return list;
  }

  scroll = ($event) => {
    this.event = $event;
    if($event.srcElement.scrollHeight - $event.srcElement.scrollTop < window.innerHeight*1.2){
      if(this.fetch){
        this.fetch = !this.fetch;
        this.listMsg(window.localStorage.getItem('nextPageToken'));
      }
    }
  }
}

export interface emailList {
  snippet       : string;
  id            : string;
  email         : string;
  payload       : string;
  internalDate  : string;
  labelIds      : string[];
  from          : string;
  subject       : string;
  important     : boolean;
  keywords      : string;
}