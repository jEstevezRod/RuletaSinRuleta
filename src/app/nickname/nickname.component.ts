import {Component} from '@angular/core';
import {SocketService} from "../socket.service";

@Component({
    selector: 'app-nickname',
    templateUrl: './nickname.component.html',
    styleUrls: ['./nickname.component.css']
})
export class NicknameComponent {


    public nombre;

    constructor(public _Socket: SocketService) {
    }

    public sendName() {
        this._Socket.newUser(this.nombre);
    }
}
