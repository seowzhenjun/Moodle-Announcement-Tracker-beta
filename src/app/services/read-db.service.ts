import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import "rxjs/add/observable/of";
import 'rxjs/add/observable/fromPromise';
import {Observable} from 'rxjs/Rx';

import { GmailhttpService } from './gmailhttp.service';
import { oAuth2Service } from './oAuth2.service';
import { DataService } from '../main/data.service';
declare var window;

@Injectable()
export class ReadDBService {

    database : any = firebase.database();
    constructor(
        private _http    : GmailhttpService,
        private _service : DataService,
        private _oAuth2  : oAuth2Service
    ){}

    getAccessToken(email){
        this._service.loading = true;
        let dbRef = this.database.ref('GmailSub');
        let obj = JSON.parse(window.localStorage.getItem('obj'));
        dbRef.orderByChild('userName').equalTo(email).once('value').then(
            snapshot => {
                let dbkey = Object.keys(snapshot.val())[0];
                snapshot.forEach(childSnapshot=>{
                    this._oAuth2.getAccessToken(childSnapshot.val().refreshToken).subscribe(
                        accessToken => {
                            for ( var key in accessToken){
                                if (key === 'access_token'){
                                    obj['accessToken']=accessToken[key];
                                    window.localStorage.setItem('obj',JSON.stringify(obj));
                                }
                            }
                            this.partialSync(childSnapshot.val().historyId,obj,dbkey);
                        },
                        err => console.log(err)
                    )
                });
            }
        )
    }

    partialSync(historyId,obj,dbKey){
        let msgAdded = [];
        let msgDeleted = [];
        if(window.localStorage.getItem('historyId') === null){
            this._service.loading = false;
            window.localStorage.setItem('historyId',historyId);
            return;
        }
        else{
            let historyId = window.localStorage.getItem('historyId');
            this._http.historyList(obj.email,obj.accessToken,historyId).subscribe(
                res => {
                    for(var key in res){
                        if(key==='historyId'){
                            window.localStorage.setItem('historyId',res[key]);
                            this.database.ref(`GmailSub/${dbKey}`).update({
                                historyId : res[key]
                            })
                        }
                        if(key==='history'){
                            for(let i=0; i<res[key].length; i++){
                                if(res[key][i].messagesAdded){
                                    msgAdded.push(res[key][i].messagesAdded[0].message.id);
                                }
                                if(res[key][i].labelsAdded){
                                    if(res[key][i].labelsAdded[0].labelIds[0] === 'TRASH'){
                                        msgDeleted.push(res[key][i].labelsAdded[0].message.id);
                                    }
                                }
                            }
                        }
                    }
                    this.changeLocalEmail(msgAdded,msgDeleted);
                }
            );
        }
    }

    changeLocalEmail(msgAdded,msgDeleted){        
        let promiseArr = [];
        let obj = JSON.parse(window.localStorage.getItem('obj'));
        if(msgAdded.length !== 0){
            for(let i=0; i<msgAdded.length; i++){
                promiseArr[i] = new Promise ((resolve) =>{
                    this._http.getMsg(obj.email,msgAdded[i],obj.accessToken)
                    .subscribe(
                    result => resolve(result),
                    err => console.log(err)
                  );
                })
            }
            Promise.all(promiseArr).then(val => {
                let msgArr = this.sortMsg(val);
                this.getEmailDetail(msgArr,false);
            });
        }

        if(msgDeleted.length !== 0){
            for(let i=0; i<msgDeleted.length; i++){
                this.deleteEmail(msgDeleted[i]);
            }
        }

        this._service.loading = false;
    }

    getEmailDetail(email,push:boolean){
        let list = JSON.parse(window.localStorage.getItem('email'));
        let emailList:emailList[] = list === null? [] : list;
        let importantMsgArr;
        this.getImportantMsg().then(
            resolve => {
                importantMsgArr=resolve;
                for(var i=0; i<email.length; i++){
                    let item = email[i].payload.headers;
                    let body = {} as emailList;
                    body['snippet']     = email[i].snippet;
                    body['id']          = email[i].id;
                    body['payload']     = email[i].payload;
                    body['internalDate']= email[i].internalDate;
                    body['labelIds']    = email[i].labelIds;
                    body['important']   = false;
                    for(let y=0; y<importantMsgArr.length; y++){
                        if(email[i].id == importantMsgArr[y]){
                            body['important']=true;
                        }
                    }
                    for(var x=0; x<item.length; x++){
              
                      if(item[x].name === "From"){
                        body['from'] = item[x].value.split('<')[0];
                        body['email']= item[x].value.substring(item[x].value.lastIndexOf("<")+1,item[x].value.lastIndexOf(">"));
                      }
                      if(item[x].name === "Subject"){
                        body['subject'] = item[x].value;
                      }
                    }
                    if(push){
                        emailList.push(body);
                    }
                    else{
                        emailList.unshift(body);
                    }
                  }
                window.localStorage.setItem('email',JSON.stringify(emailList));
                this._service.sendList(emailList);
            },
            reject  => console.log(reject)
        ); 
      }

    deleteEmail(id){
        let emailList = JSON.parse(window.localStorage.getItem('email'));
        let index = emailList.findIndex(x => x.id === id);
        emailList.splice(index,1);
        window.localStorage.setItem('email',JSON.stringify(emailList));
        this._service.sendList(emailList);
    }

    sortMsg(msgArr){
        let swap : boolean = true;
        let temp;
        while(swap){
        swap = false;
          for (var i = 0 ; i < msgArr.length-1; i ++){
              if (msgArr[i].internalDate>msgArr[i+1].internalDate){
                  temp = msgArr[i+1];
                  msgArr[i+1] = msgArr[i];
                  msgArr[i] = temp;
                  swap = true;
              }
          }
        }
        return msgArr;
    }

    getImportantMsg(){
        let dbRef = this.database.ref('ImportantMsgId');
        let obj = JSON.parse(window.localStorage.getItem('obj'));
        let msgArr : any[] = [];
        return new Promise((resolve,reject)=>{
            dbRef.orderByChild('userName').equalTo(obj.email).once('value').then(
                snapshot => {
                    if(snapshot.val() !== null){
                        //let dbkey = Object.keys(snapshot.val())[0];
                        snapshot.forEach(childSnapshot=>{
                            for(let key in childSnapshot.val().id){
                                msgArr.push(key);
                            }
                        })
                    }
                    resolve(msgArr);
                },
                err => {
                    console.log(err); 
                    reject(err);
                }
            )
        });
    }

    labelImportantMsg(msgIds){
        let email = JSON.parse(window.localStorage.getItem('email'));
        let temp;
        for(let i=0; i<msgIds.length; i++){
            temp = email.findIndex(x => x.id === msgIds[i]);
            if(temp !== -1){
                email[temp].important = true;
            }
        }
        window.localStorage.setItem('email',JSON.stringify(email));
    }

    getFilterList() : Observable<filterList[]> {
        let dbRef = this.database.ref('Keyword');
        let obj = JSON.parse(window.localStorage.getItem('obj'));
        let filterList :filterList[] = [];
        let i : number = 0;

        let mypromise = new Promise<filterList[]>((resolve,reject)=>{
            dbRef.orderByChild('userName').equalTo(obj.email).once('value').then(
                snapshot=>{
                    if(snapshot.exists()){
                        snapshot.forEach(childSnapshot=>{
                            childSnapshot.forEach(snap=>{
                                for(let childKey in snap.val().keywords){
                                    let body = {} as filterList;
                                    body['position']=i;
                                    body['from'] = snap.val().name;
                                    body['email']= snap.val().from;
                                    body['id'] = childKey;
                                    body['subject']=snap.val().keywords[childKey];
                                    body['useRegex']=snap.val()['useRegex'][childKey];
                                    filterList.push(body);
                                    i++;
                                }
                            })
                            // for(var key in childSnapshot.val()){
                            //     if(key != 'userName' && childSnapshot.val()[key].keywords != undefined){
                            //         for(var childkey in childSnapshot.val()[key].keywords){
                                        // let body = {} as filterList;
                                        // body['position']=i;
                                        // body['from'] = key;
                                        // body['email']= childSnapshot.val()[key].from;
                                        // body['id'] = childkey;
                                        // body['subject']=childSnapshot.val()[key].keywords[childkey];
                                        // filterList.push(body);
                                        // i++;
                            //         }
                            //     }
                            // }
                        })
                        resolve(filterList);
                    }
                }
            )
        });
        
        return Observable.fromPromise(mypromise);
    }
}

export interface emailList {
    snippet       : string;
    id            : string;
    email         : string;
    payload       : string;
    internalDate  : string;
    labelIds      : string[];
    from          : string;
    subject       : string;
    important     : boolean;
    keywords      : string;
  }

export interface filterList{
    position: number;
    from    : string;
    subject : string;
    email   : string;
    id      : string;
    useRegex: boolean;
}