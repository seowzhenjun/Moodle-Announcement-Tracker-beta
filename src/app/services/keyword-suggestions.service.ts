import { Injectable }       from '@angular/core';
import { GmailhttpService } from './gmailhttp.service';
import { DataService } from '../main/data.service';

@Injectable()
export class KeywordSuggestionsService {

    maxShowCount : number = 5;
    obj = JSON.parse(window.localStorage.getItem('obj'));
    //alphanumeric = /^[a-z0-9]+$/i;
    loadCount : number = 0;
    nameCount : keywordCount[] = [];
    emailCount : keywordCount[] = [];
    topNameCount : keywordCount[] = [];
    topEmailCount : keywordCount[] = [];

    constructor(
        private _http : GmailhttpService,
        private _service : DataService
    ){}

    getKeywords(){
        this._http.listMsg(this.obj.email,this.obj.accessToken,100,this._service.keywordNextPageToken).subscribe(
            result => {
                this.getMsg(this.obj, result);
            }
        );
    }

    getMsg(obj, result){
        var promiseArr = [];
        for(let key in result){
            if(key ==="nextPageToken"){
                this._service.keywordNextPageToken = result[key];
            }
            if(key === "messages"){
                for(var i=0; i< result[key].length; i++){
                promiseArr[i] = new Promise ((resolve) =>{
                    this._http.getMsg(obj.email,result[key][i].id,obj.accessToken)
                    .subscribe(
                    result => resolve(result),
                    err => console.log(err)
                    );
                })
                }
                Promise.all(promiseArr).then(val => {
                this.getEmailDetail(val);
                });
            }
        };
    }

    getEmailDetail(email){
        let list : emailList[] = [];
        for(var i=0; i<email.length; i++){
            let item = email[i].payload.headers;
            let body = {} as emailList;
            for(var x=0; x<item.length; x++){
        
                if(item[x].name === "From"){
                    if(item[x].value.indexOf('<')!== -1){
                        body['from'] = item[x].value.split('<')[0];
                        body['email']= item[x].value.substring(item[x].value.lastIndexOf("<")+1,item[x].value.lastIndexOf(">"));
                    }
                    else{
                        body['from'] = item[x].value;
                        body['email'] = item[x].value;
                    }
                }
                if(item[x].name === "Subject"){
                body['subject'] = item[x].value;
                }
            }
            list.push(body);
        }
        this.getTopKeywords(list);
    }

    getTopKeywords(list){
        if(!this._service.topSender.length){
            this.nameCount = [];
            this.emailCount = [];
            this.topEmailCount = [];
            this.topNameCount = [];
            this.loadCount = 0;
        }
        
        //let subjectCount : keywordCount[] = [];
        for(let i=0; i<list.length; i++){
            //let subjectArr = [];
            const nameKeyword = this.nameCount.find(keyword => keyword.name === list[i].from);
            const emailKeyword = this.emailCount.find(keyword=> keyword.name === list[i].email);
            if(nameKeyword !== undefined){
                nameKeyword.count ++;
            }
            else{
                const key : keywordCount = {
                    name : list[i].from,
                    count : 1,
                    attribute : 'from'
                }
                this.nameCount.push(key);
            }

            if(emailKeyword !== undefined){
                emailKeyword.count ++;
            }
            else{
                const key : keywordCount = {
                    name : list[i].email,
                    count : 1,
                    attribute : 'email'
                }
                this.emailCount.push(key);
            }

            // subjectArr = list[i].subject.split(" ");
            // for(let j=0; j<subjectArr.length; j++){
            //     if(this.alphanumeric.test(subjectArr[j]) && isNaN(subjectArr[j])){
            //         const subjectKeyword = subjectCount.find(keyword => keyword.name === subjectArr[j]);
            //         if(subjectKeyword !== undefined){
            //             subjectKeyword.count++;
            //         }
            //         else{
            //             const key : keywordCount = {
            //                 name : subjectArr[j],
            //                 count : 1,
            //                 attribute : 'subject'
            //             }
            //             subjectCount.push(key);
            //         }
            //     }
            // }

        }
        this.nameCount.sort(function(a,b){return b.count - a.count});
        this.emailCount.sort(function(a,b){return b.count - a.count});
        //subjectCount.sort(function(a,b){return b.count - a.count});

        if(this._service.topSender.length){
            for (let x=0; x<this.nameCount.length; x++){
                if(this.topNameCount.find(keyword=>keyword.name === this.nameCount[x]['name']) === undefined){
                    this.topNameCount.push(this.nameCount[x]);
                }
                if(this.topNameCount.length > (this.maxShowCount*(this.loadCount+1))-1){
                    break;
                }
            }
            for (let x=0; x<this.emailCount.length; x++){
                if(this.topEmailCount.find(keyword=>keyword.name === this.emailCount[x]['name']) === undefined){
                    this.topEmailCount.push(this.emailCount[x]);
                }
                if(this.topEmailCount.length > (this.maxShowCount*(this.loadCount+1))-1){
                    break;
                }
            }
        }
        else{
            this.topNameCount = this.nameCount.slice(0,this.maxShowCount);
            this.topEmailCount = this.emailCount.slice(0,this.maxShowCount);
        }
        // this._service.topSender = this.topNameCount.slice(this.maxShowCount*this.loadCount,this.maxShowCount*(this.loadCount+1));
        // this._service.topEmail = this.topEmailCount.slice(this.maxShowCount*this.loadCount,this.maxShowCount*(this.loadCount+1));
        
        this._service.topSender = this.topNameCount.slice(0,this.maxShowCount*(this.loadCount+1));
        this._service.topEmail = this.topEmailCount.slice(0,this.maxShowCount*(this.loadCount+1));

        this._service.keywordLoading = false;
        this.loadCount++;
    }
}

export interface emailList{
    from : string ;
    email : string ;
    subject : string ;
}

export interface keywordCount{
    name : string;
    count : number;
    attribute : string;
}