import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-caja',
    templateUrl: './caja.component.html',
    styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {

    @Input() caja;

    constructor() {
    }

    ngOnInit() {
    }

}
