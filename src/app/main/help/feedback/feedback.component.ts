import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { CloudFunctionService } from '../../../services/cloud-function.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {

  loading : boolean = false;
  feedbackForm: FormGroup;
  stayAnonymous : boolean = false;
  feedbackType = [
    {value : 'bug', description:'Bug'},
    {value : 'feature', description:'Feature request'},
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

  setUpRating =['star_border','star_border','star_border','star_border','star_border'];
  tutorialRating =['star_border','star_border','star_border','star_border','star_border'];
  suggestedKeywordRating =['star_border','star_border','star_border','star_border','star_border'];
  notificationRating =['star_border','star_border','star_border','star_border','star_border'];
  rate = [{
    setUpRating : 0,
    tutorialRating : 0,
    suggestedKeywordRating : 0,
    notificationRating : 0
  }];

    constructor(
      private _cf : CloudFunctionService,
      private formbuilder : FormBuilder,
      private snackBar : MatSnackBar
    ) {}

    ngOnInit(){
      this.feedbackForm = this.formbuilder.group({
        feedbackType    : '',
        bugType         : '',
        severity        : '',
        bugDescription  : '',
        featureDescription : '',
        feedbackDescription : '',
        otherDescription : ''

      })
    }

    changeRating(ind,ratingType){
      let rating = ['star_border','star_border','star_border','star_border','star_border'];
      let index = ind +1 ;

      this.rate[ratingType]=index;
      
      for(let i=0; i<index; i++){
        rating[i] = 'star';
      }

      for(let i=index;i<rating.length; i++){
        rating[i] = 'star_border';
      }

      switch (ratingType){
        case 'setUpRating':
          this.setUpRating = rating;
        break;
        case 'tutorialRating':
          this.tutorialRating = rating;
        break;
        case 'suggestedKeywordRating':
          this.suggestedKeywordRating = rating;
        break;
        case 'notificationRating':
          this.notificationRating = rating;
        break;
      }
    }

    sendFeedback(){
      this.loading = true;
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
        case 'feedback':
          let overallRating = (this.rate['setUpRating']+this.rate['tutorialRating']+this.rate['suggestedKeywordRating']+this.rate['notificationRating'])/5;
          overallRating = Math.round( overallRating * 10) / 10;
          body['setUpRating'] = this.rate['setUpRating'];
          body['tutorialRating'] = this.rate['tutorialRating'];
          body['suggestedKeywordRating'] = this.rate['suggestedKeywordRating'];
          body['notificationRating'] = this.rate['notificationRating'];
          body['overallRating'] = overallRating;
          body['description'] = this.feedbackForm.get('feedbackDescription').value;
          break;
        case 'other':
          body['description'] = this.feedbackForm.get('otherDescription').value;
          break;
        default :
          break;
      }
      this._cf.sendFeedback(obj.email,body).subscribe(response=>{
        this.loading = false;
        if(response['response'] == 'success'){
          this.snackBar.open("We've received your feedback, thank you!",null,{duration : 2000});
        }
        else {
          this.snackBar.open("Something went wrong. Please try again later.",null,{duration : 2000});
        }
      },err=>{
        console.log(err);
      });
    }
}
