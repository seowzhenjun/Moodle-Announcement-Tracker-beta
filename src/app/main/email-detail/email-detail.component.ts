import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import 'rxjs/add/operator/switchMap';

import { DataService } from '../data.service';

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-email-detail',
  templateUrl: './email-detail.component.html'
})
export class EmailDetailComponent implements OnInit {
  id        : any;
  emailHTML : any;
  html      : SafeHtml;
  emailList : any;
  star      : string;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private _service : DataService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => this.id = params['id']);
    this.emailList = this._service.payload;
    if(this._service.payload != ""){
      this.html = this.getBody(this._service.payload.payload);
      this.star = this._service.payload.important ? 'star' : 'star_border';
    }
    // this._service.currentPayload.subscribe(message => 
    //   {
    //     this.emailList = message;
    //     if (message !== ""){
    //       this.html = this.getBody(message.payload);
    //     }
    //   },
    // err=> console.log(err)
    // );
  }

  ngAfterViewInit(){
    // let table = document.getElementsByTagName('table');
    // if(table !== null){
    //   let scale = (window.outerWidth/table[0].offsetWidth);
    //   if(scale < 0.9){
    //     console.log(scale);
    //     table[0].style.transform=`scale(${scale}) translate(-40%,-40%)`;
    //   }
    // }
  }

  getBody(message) {
    var encodedBody = '';
    if(typeof message.parts === 'undefined')
    {
      encodedBody = message.body.data;
    }
    else
    {
      encodedBody = this.getHTMLPart(message.parts);
    }
    encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
    return decodeURIComponent(encodeURIComponent(window.atob(encodedBody)));
  }

  getHTMLPart(arr) {
      for(var x = 0; x <= arr.length; x++)
      {
        if(typeof arr[x].parts === 'undefined')
        {
          if(arr[x].mimeType === 'text/html')
          {
            return arr[x].body.data;
          }
        }
        else
        {
          return this.getHTMLPart(arr[x].parts);
        }
      }
      return '';
  }
}