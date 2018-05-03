import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class GmailhttpService {

  constructor(private http: HttpClient) { }

  listMsg(email,accessToken,maxResults,nextPageToken? : string){
    // const maxResults = '100';
    const labelIds = "INBOX";
    const url = `https://www.googleapis.com/gmail/v1/users/${email}/messages`;
    const headerDict = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };
    let params :any;
    if(nextPageToken !== null){
      params = new HttpParams().set('maxResults', maxResults).set('pageToken',nextPageToken).set('labelIds',labelIds);
    }
    else{
      params = new HttpParams().set('maxResults', maxResults).set('labelIds',labelIds);
    }
    const requestOptions = {
      headers : new HttpHeaders (headerDict),
      params : params
    };

    return this.http.get(url,requestOptions);
  }

  getMsg(email,id,accessToken){
    const url = `https://www.googleapis.com/gmail/v1/users/${email}/messages/${id}`;
    const headerDict = {
      'Content-Type' : 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };
    
    const requestOptions = {
      headers : new HttpHeaders (headerDict)
    };

    return this.http.get(url,requestOptions);
  }

  historyList(email,accessToken,startHistoryId){
    const url = `https://www.googleapis.com/gmail/v1/users/${email}/history`;
    const headerDict = {
      'Content-Type' : 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };
    let params :any;
    params = new HttpParams().set('startHistoryId',startHistoryId)
    .set('historyTypes','messageAdded')
    .append('historyTypes','messageDeleted')
    .append('historyTypes','labelAdded')
    const requestOptions = {
      headers : new HttpHeaders (headerDict),
      params: params
    };

    return this.http.get(url,requestOptions);
  }

  modify(id,email,accessToken){
    const url = `https://www.googleapis.com/gmail/v1/users/${email}/messages/${id}/modify`;
    const headerDict = {
      'Content-Type' : 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };
    const body = {
      removeLabelIds : [
        "UNREAD"
      ]
    }
    const requestOptions = {
      headers : new HttpHeaders (headerDict)
    };

    return this.http.post(url,body,requestOptions);
  }

  watch(email,accessToken){
    const url = `https://www.googleapis.com/gmail/v1/users/${email}/watch`;
    const headerDict = {
      'Content-Type' : 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
    const body ={
      topicName: 'projects/moodle-announcement-trac-347e7/topics/gmail-push-notification',
      labelIds: [ 'INBOX' ]
    }
    const requestOptions = {
      headers : new HttpHeaders (headerDict)
    };

    return this.http.post(url,body,requestOptions);
  }
}