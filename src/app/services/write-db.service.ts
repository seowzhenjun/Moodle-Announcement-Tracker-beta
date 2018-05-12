import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {DataService} from '../main/data.service';
@Injectable()
export class WriteDBService {

    database : any = firebase.database();
    keywordRef = this.database.ref('Keyword');
    importantMsgIdRef = this.database.ref('ImportantMsgId');
    recentMsgRef = this.database.ref('RecentMsg');

    constructor(private _service : DataService){}

    setKeywords(keywords,set? : boolean){
        let matched : boolean = false;
        const obj = JSON.parse(window.localStorage.getItem('obj'));
        if(set == null){set=true};
        this.keywordRef.orderByChild('userName').equalTo(obj.email).once('value').then(
            snapshot => {
                if(snapshot.exists()){
                    const key = Object.keys(snapshot.val())[0]; // To get the unique key
                    const ref = this.database.ref(`Keyword/${key}`);
                    snapshot.forEach(
                        childSnap=>{
                            for(let i=0;i<keywords.length;i++){
                                const keywordSubject = set ? keywords[i].subject : null;
                                childSnap.forEach(
                                    snap=>{
                                        if(snap.val()['name']==keywords[i].from && snap.val()['from']==keywords[i].email){
                                            ref.child(`${snap.key}/keywords`).update({
                                                [keywords[i].id] : keywordSubject
                                            })
                                            .then(()=>{
                                                ref.child(`${snap.key}/keywords`).once('value',snapshot=>{
                                                    if(!snapshot.exists()){
                                                        ref.child(snap.key).remove()
                                                        .then(()=>{
                                                            this._service.sendRemoveFilter();
                                                        });
                                                    }
                                                    else{
                                                        this._service.sendRemoveFilter();
                                                    }
                                                });
                                            });
                                            matched = true;
                                        }
                                    
                                    }
                                )
                                if(!matched){
                                    const newKeywordRef = ref.push();
                                    newKeywordRef.set({
                                        from : keywords[i].email,
                                        name : keywords[i].from,
                                        keywords : {
                                            [keywords[i].id] : keywordSubject
                                        }
                                    }).then(()=>{
                                        newKeywordRef.child('keywords').once('value',snapshot=>{
                                            if(!snapshot.exists()){
                                                newKeywordRef.remove();
                                            }
                                        });
                                    });
                                }
                                matched = false;
                            }
                        }
                    )
                }
            }
        )
    }

    setImportantMsgId(element,set? : boolean){
        const obj = JSON.parse(window.localStorage.getItem('obj'));
        if(set == null){set = true;}
        set = set? true : null;
        this.importantMsgIdRef.orderByChild('userName').equalTo(obj.email).once('value').then(
            snapshot => {
                if(snapshot.val() != null){
                    const key = Object.keys(snapshot.val())[0]; // To get the unique key
                    for(let i=0;i<element.length;i++){
                        const keywordsRef = this.database.ref(`ImportantMsgId/${key}/id`);
                        keywordsRef.update({
                            [element[i].id] : set
                        });
                    }
                }
            }
        )
    }

    setupDb(){
        const obj = JSON.parse(window.localStorage.getItem('obj'));
        this.keywordRef.orderByChild('userName').equalTo(obj.email).once('value').then(
            snapshot => {
                if(snapshot.val()==null){
                    this.keywordRef.push().set({
                        userName : obj.email
                    });
                }
            }
        );
        this.importantMsgIdRef.orderByChild('userName').equalTo(obj.email).once('value').then(
            snapshot => {
                if(snapshot.val()==null){
                    this.importantMsgIdRef.push().set({
                        userName : obj.email
                    });
                }
            }
        );
        this.recentMsgRef.orderByChild('userName').equalTo(obj.email).once('value').then(
            snapshot => {
                if(snapshot.val()==null){
                    this.recentMsgRef.push().set({
                        userName : obj.email
                    });
                }
            }
        );
    }
}