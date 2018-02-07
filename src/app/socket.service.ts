import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

@Injectable()
export class SocketService {

  public userdata;
  public nose = new Subject();
  public nose$ = this.nose.asObservable();
  private url = 'http://localhost:3000';
  private socket;

  constructor() {
    this.socket = io(this.url);
  }

  getName(): Observable<string> {
    return Observable.create((observer) => {
      this.socket.on('user', (data) => {
        observer.next(data);
        console.log(data)
      })
    })
  };

  sendName(name) {
    this.userdata = {name: name};
    this.socket.emit('new-user', name)
  }

}


