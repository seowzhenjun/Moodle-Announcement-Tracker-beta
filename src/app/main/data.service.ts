import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()

export class DataService {
  //private payload = new BehaviorSubject<any>("");
  private emailList = new BehaviorSubject<any>("");
  //private newEmail = new BehaviorSubject<any>("");
  private highlight = new BehaviorSubject<boolean>(false);
  private element = new BehaviorSubject<any>("");
  private view = new BehaviorSubject<boolean>(false);
  private important = new BehaviorSubject<boolean>(false);
  private filterList = new BehaviorSubject<any>("");
  private removeFilter = new BehaviorSubject<boolean>(false);

  //currentPayload = this.payload.asObservable();
  currentEmailList = this.emailList.asObservable();
  //currentNewEmail = this.newEmail.asObservable();
  isHighlight = this.highlight.asObservable();
  currentElement = this.element.asObservable();
  updateView = this.view.asObservable();
  markAsImportant = this.important.asObservable();
  currentFilterList = this.filterList.asObservable();
  removeCurrentFilter = this.removeFilter.asObservable();

  title   : string = "Inbox";
  disconnect : boolean;
  showImportantEmail : boolean = false;
  loading : boolean ;
  payload : any = "";
  topSender : any = [];
  topEmail : any = [];
  keywordNextPageToken : any = null;
  keywordLoading : boolean = false;

  constructor() { }

  // sendPayload(message: any) {
  //   this.payload.next(message);
  // }

  sendList(list: any){
    this.emailList.next(list);
  }

  // sendNewEmail(email: any){
  //   this.newEmail.next(email);
  // }

  sendHighlight(highlight: boolean){
    this.highlight.next(highlight);
  }

  sendId(element:any){
    this.element.next(element);
  }

  sendUpdateView(){
    this.view.next(true);
  }

  sendMarkAsImportant(){
    this.important.next(true);
  }

  sendFilterList(data:any){
    this.filterList.next(data);
  }

  sendRemoveFilter(){
    this.removeFilter.next(true);
  }
}