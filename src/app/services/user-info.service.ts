import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UserInfoService {
  private messageSource = new BehaviorSubject<any>("");
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  sendUserInfo(message: any) {
    this.messageSource.next(message);
  }
}