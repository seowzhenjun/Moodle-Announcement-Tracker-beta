import { Component }  from '@angular/core';
import { Router }     from '@angular/router';
import { WriteDBService } from '../../../services/write-db.service';

@Component({
  selector: 'app-new-filter',
  templateUrl: './new-filter.component.html',
  styleUrls: ['./new-filter.component.css']
})
export class NewFilterComponent {

  from    : string = "";
  subject : string = "";
  email   : string = "";

  constructor(
    private _db : WriteDBService
  ){}

  newFilterRule(){
    let key = {} as keyword;
    key.from = this.from;
    key.subject = this.subject;
    key.email = this.email;
    this._db.setKeywords([key]);
  }
}

export interface keyword {
  from    : string;
  subject : string;
  email   : string;
}
