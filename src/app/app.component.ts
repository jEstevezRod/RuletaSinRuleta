import {Component, OnInit} from '@angular/core';
import {SocketService} from "./socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  mensaje;
  mensajes = [];

  constructor(public _SocketService: SocketService) {

  }

  ngOnInit() {

  }

  send() {
    this._SocketService.sendName(this.mensaje);
    this.mensaje = '';
  }

}
