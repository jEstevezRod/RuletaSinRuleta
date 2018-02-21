import {Component, OnInit} from '@angular/core';
import {SocketService} from "../socket.service";
import {Router} from "@angular/router";

declare var $: any;

@Component({
    selector: 'app-ganador',
    templateUrl: './ganador.component.html',
    styleUrls: ['./ganador.component.css']
})
export class GanadorComponent implements OnInit {
    public winner;

    constructor(public _Socket: SocketService, public router: Router) {
    }

    ngOnInit() {
        this._Socket.roomInfo$.subscribe(data => {
            this.winner = data;
            console.log("sus");
            console.log(this.winner);
            console.log(this.winner.name)
        });

        if (!this.winner) {
            this.winner = (String(this._Socket.currentWinner.name));
            console.log(this.winner);
            console.log(typeof this.winner)
        }
        this._Socket.newGame$.subscribe(data => {
            this.router.navigate(['/tabla']);

        })
    }

    backtoHome() {
        this._Socket.gotoback()
    }


}
