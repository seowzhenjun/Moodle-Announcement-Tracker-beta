import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { CloudFunctionService } from '../../../services/cloud-function.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {

  feedbackForm: FormGroup;
  stayAnonymous : boolean = true;
  feedbackType = [
    {value : 'bug', description:'Bug'},
    {value : 'feature', description:'Feature request'},
    {value : 'suggestion', description:'Suggestion'},
    {value : 'feedback', description:'Let us know how we did'},
    {value : 'other', description:'Other'}
  ];
  bugType = [
    {value : 'notSync', description : 'Inbox not synchronised'},
    {value : 'crash', description : 'App crashes when performing certain action'},
    {value : 'notSet', description : 'Filter rule cannot be set'},
    {value : 'wrongEmail', description : "Receiving email that I don't consider as important"},
    {value : 'noNotification', description : 'Not receiving notification on important email'},
    {value : 'otherBug', description : 'Other'},
  ];
  severity = [
    {value : 'minor', description : "It bothers me a lil, but it's not affecting the functionality"},
    {value : 'medium', description : "It's somehow concerning as I can't perform certain action"},
    {value : 'severe', description : "It's fatal! App cannot function when it occur"},
    {value : 'notSure', description : "I don't know"},
  ];
    constructor(
      private _cf : CloudFunctionService,
      private formbuilder : FormBuilder
    ) {}

    ngOnInit(){
      this.feedbackForm = this.formbuilder.group({
        feedbackType    : '',
        bugType         : '',
        severity        : '',
        bugDescription  : '',
        featureDescription : '',
        suggestionDescription : '',
        feedbackDescription : '',
        otherDescription : ''

      })
    }

    show(){
      console.log(this.stayAnonymous);
    }

    sendFeedback(){
      let body : any = {};
      let obj = JSON.parse(window.localStorage.getItem('obj'));
      body['feedbackType'] = this.feedbackForm.get('feedbackType').value;
      body['anonymous']= this.stayAnonymous;
      body['userName']=obj.displayName;
      body['email']=obj.email;
      switch(this.feedbackForm.get('feedbackType').value){
        case 'bug':
          body['bugType'] = this.feedbackForm.get('bugType').value;
          body['severity'] = this.feedbackForm.get('severity').value;
          body['description'] = this.feedbackForm.get('bugDescription').value;
          break;
        case 'feature':
          body['description'] = this.feedbackForm.get('featureDescription').value;
          break;
        case 'suggestion':
          body['description'] = this.feedbackForm.get('suggestionDescription').value;
          break;
        case 'feedback':
          body['description'] = this.feedbackForm.get('feedbackDescription').value;
          break;
        case 'other':
          body['description'] = this.feedbackForm.get('otherDescription').value;
          break;
        default :
          break;
      }
      this._cf.sendFeedback(obj.email,body).subscribe();
    }
}
