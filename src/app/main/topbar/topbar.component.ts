import { Component, Inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { MatSnackBar } from '@angular/material';

import { WelcomeDialogComponent } from '../welcome-dialog/welcome-dialog.component';
import { DialogComponent } from '../dialog/dialog.component';
import { DataService } from '../data.service';
import { WriteDBService } from '../../services/write-db.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  @Input() title : string;
  @Output() menuToggle = new EventEmitter<boolean>();

  currentFilterList : any ;
  filterList  : boolean = false;
  toggle      : boolean = true;
  highlighted : boolean ;
  star        : string = 'star_border';
  element     : any = '';
  impMark     : boolean = false;
  fileNameDialogRef: MatDialogRef<DialogComponent>;

  constructor(
    public _service : DataService,
    private snackBar : MatSnackBar,
    private dialog   : MatDialog,
    private keywords : WriteDBService
  ) { }

  ngOnInit() {
    this._service.isHighlight.subscribe(
      isHighlight => this.highlighted = isHighlight
    );
    this._service.currentElement.subscribe(
      element => {
        this.impMark = false;
        this.star = 'star_border';
        this.element = element;
        for(let i=0 ; i< element.length; i++){
          if(!element[i].important){
            this.star = 'star';
            this.impMark = true;
          }
        }
      }
    );
    this._service.markAsImportant.subscribe(
      important => {
        if(important){
          this.markAsImportant(this.element,true);
          this.element = '';
        }
      }
    );
    this._service.currentFilterList.subscribe(
      filterList => {
        if(filterList.length > 0 ){
          this.currentFilterList =filterList;
          this.filterList = true;
        }
        else{
          this.filterList = false;
        }
      }
    );
  }

  toggleMenu(){
    this.menuToggle.emit(this.toggle);
  }

  cancelHighlight(){
    this._service.sendHighlight(false);
    this.element = '';
  }

  updateHighlightedEmail(){
    if(this.impMark){
      this.openDialog();
    }
    else{
      this.markAsImportant(this.element,false);
    }
  }

  markAsImportant(element,imp:boolean){
    if(element === ''){
      this.cancelHighlight();
      return;
    }
    let email = JSON.parse(window.localStorage.getItem('email'));
    let temp ;
    let message = imp? "Email marked as important" : "Email marked as not important";
    for(let i=0; i<element.length; i++){
      temp = email.findIndex(x => x.id === element[i].id);
      if(temp !== -1){
        if(email[temp].important){
          this.keywords.setImportantMsgId([email[temp]],false);
          this.keywords.setKeywords([email[temp]],false);
        }
        email[temp].important = imp;
      }
    }
    window.localStorage.setItem('email',JSON.stringify(email));
    this._service.sendUpdateView();
    this.cancelHighlight();
    this.openSnackbar(message);
  }

  openSnackbar(message){
    this.snackBar.open(message,null,{duration : 2000});
  }

  openDialog(){
    let dialogList : dialogList[] = [];
    for(let i=0; i<this.element.length; i++){
      if(!this.element[i].important){
        let body = {} as dialogList;
        body['from']    = this.element[i].from;
        body['subject'] = this.element[i].subject;
        body['id']      = this.element[i].id;
        body['email']   = this.element[i].email;
        body['ignoreOther'] = false;
        dialogList.push(body);
      }
    }
    for(let i=0; i<this.element.length; i++){
      if(this.element[i].important){
        this.element.splice(i,1);
      }
    }
    this.fileNameDialogRef = this.dialog.open(DialogComponent, {
      data : dialogList,
      autoFocus: false,
      maxWidth : '90vw',
      width : '90vw'
    });
  }

  showChange($event){
    this._service.showImportantEmail = $event.checked;
  }

  editCurrentFilter(){
    this.fileNameDialogRef = this.dialog.open(DialogComponent, {
      data : this.currentFilterList,
      autoFocus: false,
      maxWidth : '90vw',
      width : '90vw'
    });
  }

  deleteFilter(){
    this.keywords.setKeywords(this.currentFilterList,false);
    // this._service.sendRemoveFilter();
    this.cancelHighlight();
  }
}

export interface dialogList {
  from        : string;
  subject     : string;
  id          : string;
  email       : string;
  ignoreOther : boolean;
}