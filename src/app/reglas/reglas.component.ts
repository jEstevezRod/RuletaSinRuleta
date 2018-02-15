import {Component, OnInit} from '@angular/core';
import {SocketService} from "../socket.service";

@Component({
    selector: 'app-reglas',
    templateUrl: './reglas.component.html',
    styleUrls: ['./reglas.component.css']
})
export class ReglasComponent implements OnInit {

    constructor(public _Socket: SocketService) {
    }

    ngOnInit() {
    }



}
