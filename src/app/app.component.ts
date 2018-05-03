import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { PasswordService } from './services/password.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private _pw : PasswordService
  ){
    // Initialize Firebase
    var config = {
      apiKey: this._pw.apiKey,
      authDomain: "moodle-announcement-trac-347e7.firebaseapp.com",
      databaseURL: "https://moodle-announcement-trac-347e7.firebaseio.com",
      projectId: "moodle-announcement-trac-347e7",
      storageBucket: "moodle-announcement-trac-347e7.appspot.com",
      messagingSenderId: "115491863039"
    };
    firebase.initializeApp(config);
  }
}