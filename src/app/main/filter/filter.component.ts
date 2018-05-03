import { Component } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatDialogRef,MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent{

    fileNameDialogRef: MatDialogRef<DialogComponent>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dialog   : MatDialog,
    ){}

    newFilter(){
        let newFilterSubject : dialogList = {
            from : '',
            subject : '',
            email : '',
            id : new Date().getTime().toString()    
        };
        
        this.fileNameDialogRef = this.dialog.open(DialogComponent, {
            data : [newFilterSubject],
            autoFocus: false,
            maxWidth : '90vw',
            width : '90vw'
        });
    }
}

export interface dialogList {
    from    : string;
    subject : string;
    id      : string;
    email   : string;
  }
