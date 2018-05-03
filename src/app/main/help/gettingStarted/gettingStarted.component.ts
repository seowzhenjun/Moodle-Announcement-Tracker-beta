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
    facultyList : string[] = ['Engineering','Business','Accounting','Law'];
    commonWords : string[] = ['Forum','Monash University','Examination'];
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

    constructor(
        private fb: FormBuilder,
        private router : Router,
        private _setKey : WriteDBService) {
        this.form = fb.group({
            'faculty' : ''
        })
    }
    
    ngOnInit(){}

    submit() : void {
        console.log(this.form.controls['faculty'].value);
        this._setKey.setKeywords(this.form.controls['faculty'].value);
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