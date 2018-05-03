import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { PasswordService } from './password.service';

@Injectable()
export class oAuth2Service { 

    constructor(
        private http: HttpClient,
        private _pw : PasswordService ) { }
    
    getRefreshToken(serverAuthCode){
        const url = 'https://www.googleapis.com/oauth2/v4/token';
        const redirectURI = 'http://localhost:8000';
        const grantType = 'authorization_code';
        const headerDict = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
    
        let body = `code=${serverAuthCode}&client_id=${this._pw.clientID}&client_secret=${this._pw.clientSecret}&grant_type=${grantType}&redirect_uri=${redirectURI}`;
        const requestOptions = {
          headers : new HttpHeaders (headerDict)
        };
        
        return this.http.post(url,body.toString(), requestOptions);
    }

    getAccessToken(refreshToken){
        const url = 'https://www.googleapis.com/oauth2/v4/token';
        const grantType = 'refresh_token';
        const headerDict = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        let body = `client_id=${this._pw.clientID}&client_secret=${this._pw.clientSecret}&refresh_token=${refreshToken}&grant_type=${grantType}`;
        const requestOptions = {
            headers : new HttpHeaders (headerDict)
        };

        return this.http.post(url,body,requestOptions);
    }
      
}