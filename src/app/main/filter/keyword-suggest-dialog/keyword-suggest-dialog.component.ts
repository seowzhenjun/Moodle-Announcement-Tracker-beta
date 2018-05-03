import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WriteDBService } from '../../../services/write-db.service';
// import { DataService } from '../data.service';

@Component({
    selector: 'app-keyword-suggest-dialog',
    templateUrl: './keyword-suggest-dialog.component.html',
    styleUrls: ['./keyword-suggest-dialog.component.css']
  })
  export class KeywordSuggestDialogComponent {
    constructor(
        public dialog : MatDialog,
        private _db : WriteDBService,
        @Inject(MAT_DIALOG_DATA) public data : any
    ){}
    
    onSubmit(){
      this._db.setKeywords(this.data);
    }
  }