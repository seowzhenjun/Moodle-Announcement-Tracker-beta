import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {MatPaginator,MatTableDataSource,MatSort,MatSnackBar} from '@angular/material';

import { ReadDBService } from '../../../services/read-db.service';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-current-filter',
  templateUrl: './current-filter.component.html',
  styleUrls: ['./current-filter.component.css']
})
export class CurrentFilterComponent {
    displayedColumns = ['from', 'subject','email'];
    currentFilterList = new MatTableDataSource<filterList>();
    length ;
    currentIndex : number[] = [-1];
    hightlightedFilterList = [];
    message ;
    loading : boolean = true;

    // Subscription variables
    getFilterListSubscribe ;
    isHighlightSubscribe ;
    removeCurrentFilterSubscribe ;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private _db : ReadDBService,
        private _service : DataService,
        private snackBar : MatSnackBar
    ){}

    ngOnInit(){
        this.getFilterListSubscribe = this._db.getFilterList().subscribe(
            data=>{
                this.currentFilterList.data = data;
                this.length = this.currentFilterList.data.length;
                this.loading = false;
            }
        );

        this.isHighlightSubscribe = this._service.isHighlight.subscribe(
            isHighlight=>{
              if(!isHighlight){
                this.currentIndex = [-1];
                this.hightlightedFilterList = [];
                this._service.sendFilterList([]);
              }
            }
        );

        this.removeCurrentFilterSubscribe = this._service.removeCurrentFilter.subscribe(
            remove => {
                if(remove){
                    this._db.getFilterList().subscribe(
                        data=>{
                            this.currentFilterList.data = data;
                            this.length = this.currentFilterList.data.length;
                            this.snackBar.open(this.message,null,{duration : 2000});
                        }
                    );
                    this.refreshTable();
                }
            }
        )
    }

    ngAfterViewInit() {
        this.currentFilterList.paginator = this.paginator;
        this.currentFilterList.sort = this.sort;
    }
    
    ngOnDestroy(){
        this._service.sendHighlight(false);
        this.getFilterListSubscribe.unsubscribe();
        this.isHighlightSubscribe.unsubscribe();
        this.removeCurrentFilterSubscribe.unsubscribe();
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.currentFilterList.filter = filterValue;
    }

    onContextMenu($event,element){
        $event.preventDefault();
        $event.stopPropagation();
        let hasHighlight : boolean ;
        let ind = this.currentIndex.findIndex(x=> x === element.position);
        let elementInd = this.hightlightedFilterList.findIndex(x => x === element.position);
        if(ind!==-1){
            this.currentIndex.splice(ind,1);
            this.hightlightedFilterList.splice(elementInd,1);
        }
        else{
            this.currentIndex.push(element.position);
            this.hightlightedFilterList.push(this.currentFilterList.data[element.position]);
        }
        hasHighlight = this.currentIndex.length>1 ? true : false;
        this.message = this.hightlightedFilterList.length > 1 ? 'Filters are deleted' : 'Filter is deleted';
        this._service.sendHighlight(hasHighlight);
        this._service.sendFilterList(this.hightlightedFilterList);
    }

    refreshTable() {
            this.currentFilterList.filter = ' ';
            this.currentFilterList.filter = '';
      }
}

export interface filterList {
    position: number;
    from    : string;
    subject : string;
    email   : string;
    useRegex: boolean;
  }