import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent {
  navList = [
    { name : 'Getting Started', icon : 'school'},
    { name : 'About', icon : 'info'},
    { name : 'Send Feedback', icon : 'feedback'}
  ] 

  constructor(
    private router : Router,
    private route : ActivatedRoute
  ){}

  gettingStarted(){
    this.router.navigate(['gettingStarted'],{relativeTo:this.route});
  }

  feedback(){
    this.router.navigate(['feedback'],{relativeTo:this.route});
  }

  about(){
    this.router.navigate(['about'],{relativeTo:this.route});
  }

  navigate(path){
    switch(path){
      case 'Getting Started':
        this.router.navigate(['gettingStarted'],{relativeTo:this.route});
      break;
      case 'Send Feedback':
        this.router.navigate(['feedback'],{relativeTo:this.route});
      break;
      case 'About':
      this.router.navigate(['about'],{relativeTo:this.route});
      break;
    }
  }
}
