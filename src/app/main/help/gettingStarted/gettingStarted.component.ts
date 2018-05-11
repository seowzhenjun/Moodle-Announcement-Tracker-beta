import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { WriteDBService } from '../../../services/write-db.service';
@Component({
  selector: 'app-gettingStarted',
  templateUrl: './gettingStarted.component.html',
  styleUrls: ['./gettingStarted.component.css']
})
export class GettingStartedComponent implements OnInit {

    isLinear = true;
    form    : FormGroup;
    facFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    currentIndex : number[] = [-1];
    highlighted : boolean = false;
    selected = "option2";
    
    sampleEmail : emailList[] = [{
        from    : 'Example 1',
        subject : 'Highlight me!',
        snippet : 'Use long press to highlight',
        date    : '1 Jan',
        id      : '123456789',
        email   : 'example@test.com',
        important : false,
        payload : '',
        internalDate : '123',
        labelIds : [''],
        keywords : ''
    },
    {
        from    : 'Example 2',
        subject : 'Highlight me too!',
        snippet : 'Use long press to highlight',
        date    : '1 Jan',
        id      : '123456789',
        email   : 'example@test.com',
        important : false,
        payload : '',
        internalDate : '123',
        labelIds : [''],
        keywords : ''
    }];

    senderName = [
        { name : 'sender1' },
        { name : 'sender2' },
        { name : 'sender3' },
        { name : 'sender4' },
        { name : 'sender5' }
    ];
    senderEmailAdd = [
        { name : 'sender1@example.com' },
        { name : 'sender2@example.com' },
        { name : 'sender3@example.com' },
        { name : 'sender4@example.com' },
        { name : 'sender5@example.com' }
    ];

    constructor(
        private fb: FormBuilder,
        private router : Router,
        private _setKey : WriteDBService) {
        this.form = fb.group({
            'faculty' : ''
        })
    }
    
    ngOnInit(){}

    cancelHighlight(){
        this.currentIndex = [-1];
        this.highlighted = false;
    }

    onContextMenu($event,i,element){
        $event.preventDefault();
        $event.stopPropagation();
        let ind = this.currentIndex.findIndex(x=> x === i);
        //let elementInd = this.highlightedElement.findIndex(x=> x.id === element.id);
        if(ind!==-1){
        this.currentIndex.splice(ind,1);
        //this.highlightedElement.splice(elementInd,1);
        }
        else{
        this.currentIndex.push(i);
        //this.highlightedElement.push(element);
        }
        if(this.currentIndex.length > 1){
            this.highlighted = true;
        }
        else{
            this.highlighted = false;
        }
    }

    suggestKeyword(){
        this.router.navigate(['/main/filter/keywordSuggest'],{ replaceUrl: true });
    }
}

export interface emailList {
  snippet       : string;
  date          : string;
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