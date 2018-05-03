import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

    convertDate(internalDate){
        let date = Number(internalDate);
        let today = new Date();
        let emailDate = new Date(date);

        let day = today.getDate();
        let month = today.getMonth();
        let year = today.getFullYear();

        let emailDay = emailDate.getDate();
        let emailMonth = emailDate.getMonth();
        let emailYear = emailDate.getFullYear();

        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nob','Dec'];
        // Date is within today
        if(day == emailDay && month == emailMonth && year == emailYear){
            let hour = emailDate.getHours();
            let min = emailDate.getMinutes();
            let Min : any = min < 10? `0${min}` : `${min}`;
            let Hour : any = hour < 10? `0${hour}` : `${hour}`;
            return `${Hour}:${Min}`;
        }
        // Date is older than today
        else{
            return `${months[emailMonth]} ${emailDay}`;
        }
        
    }
}