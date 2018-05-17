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
    navList =[
        { name : 'My Filter' , icon : 'filter_list'},
        { name : 'Keywords Suggestion' , icon : 'wb_incandescent'}
    ]
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
    navigate(path){
        switch(path){
          case 'My Filter':
            this.router.navigate(['currentFilter'],{relativeTo:this.route});
          break;
          case 'Keywords Suggestion':
            this.router.navigate(['keywordSuggest'],{relativeTo:this.route});
          break;
        }
      }
}

export interface dialogList {
    from    : string;
    subject : string;
    id      : string;
    email   : string;
  }
