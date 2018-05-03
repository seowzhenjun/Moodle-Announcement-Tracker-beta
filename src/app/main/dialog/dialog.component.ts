import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WriteDBService } from '../../services/write-db.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  selected = 'email';

  constructor(
    private _service : DataService,
    private setKeywords : WriteDBService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

    markAsImportant(){
      this.setKeywords.setKeywords(this.data);
      this.setKeywords.setImportantMsgId(this.data,true);
      this._service.sendMarkAsImportant();
    }

    checkBoxChange($event,element){
      element['ignoreOther'] = $event.checked;
    }

    cancel(){
      this._service.sendHighlight(false);
    }
}
