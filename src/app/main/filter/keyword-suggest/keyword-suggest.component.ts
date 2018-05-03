import { Component } from '@angular/core';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA,MatSnackBar} from '@angular/material';

import { KeywordSuggestDialogComponent } from '../keyword-suggest-dialog/keyword-suggest-dialog.component';
import { KeywordSuggestionsService } from '../../../services/keyword-suggestions.service';
import { DataService } from '../../data.service';

@Component({
    selector: 'app-keyword-suggest',
    templateUrl: './keyword-suggest.component.html',
    styleUrls: ['./keyword-suggest.component.css']
  })

export class KeywordSuggestionComponent{

    topSender : any = []; 
    topEmail : any = [];
    selectedChips : any = [];
    selectedKeywords : dialogList[] = [];
    filterRuleDialogRef: MatDialogRef<KeywordSuggestDialogComponent>;

    constructor(
        private _keyword : KeywordSuggestionsService,
        private dialog : MatDialog,
        public _service : DataService
    ){}

    ngOnInit(){
        this._keyword.getKeywords();
    }

    ngOnDestroy(){
        this._service.keywordNextPageToken = null;
        this._service.topEmail = [];
        this._service.topSender = [];
    }

    getMoreKeywords(){
        this._keyword.getKeywords();
        this._service.keywordLoading=true;
    }
    showChange($event,keyword){
            let currentKeyword : dialogList ;
            switch (keyword.attribute){
                case 'email':
                    if($event.selected === true){
                        currentKeyword = {
                            name    : keyword.name,
                            from    : 'any',
                            email   : keyword.name,
                            subject : 'any',
                            id      : Date.now(),
                            attribute : keyword.attribute
                        };
                        this.selectedKeywords.push(currentKeyword);
                    }
                    else{
                        let ind = this.selectedKeywords.findIndex(myKey => myKey.email === keyword.name);
                        if( ind !== -1){
                            this.selectedKeywords.splice(ind,1);
                        }
                    }
                break;
                case 'from':
                    if($event.selected === true){
                        currentKeyword = {
                            name    : keyword.name,
                            from    : keyword.name,
                            email   : 'any',
                            subject : 'any',
                            id      : Date.now(),
                            attribute : keyword.attribute
                        };
                        this.selectedKeywords.push(currentKeyword);
                    }
                    else{
                        let ind = this.selectedKeywords.findIndex(myKey => myKey.from === keyword.name);
                        if( ind !== -1){
                            this.selectedKeywords.splice(ind,1);
                        }
                    }
                break;
                default:
                break;
            }
    }

    showSelected(){
        this.filterRuleDialogRef = this.dialog.open(KeywordSuggestDialogComponent, {
            data : this.selectedKeywords,
            autoFocus: false,
            maxWidth : '90vw',
            width : '90vw'
        });
    }
}

export interface dialogList {
    name        : string;
    from        : string;
    subject     : string;
    email       : string;
    id          : number;
    attribute   : string;
  }