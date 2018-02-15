import {Component, OnInit} from '@angular/core';
import {SocketService} from "../socket.service";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

    mensaje;
    Allmensajes = [];

    constructor(public _Socket: SocketService) {
    }

    ngOnInit() {
        this._Socket.message$.subscribe(data => {
            this.Allmensajes.push(data)
        })
    }

    sendMessage() {
        this._Socket.sendMessage(this.mensaje);
        this.mensaje = "";
    }

}
