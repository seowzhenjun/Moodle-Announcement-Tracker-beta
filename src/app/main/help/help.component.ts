import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  ngOnInit() {
  }

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
}
