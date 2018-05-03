import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-welcome-dialog',
  templateUrl: './welcome-dialog.component.html',
  styleUrls: ['./welcome-dialog.component.css']
})
export class WelcomeDialogComponent {

  constructor(
    public dialog: MatDialog,
    private router : Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

    getStarted(){
        this.router.navigate(['/main/help/gettingStarted']);
    }
}
