import {Component, OnInit} from '@angular/core';
import {SocketService} from "../socket.service";

declare var $: any;

@Component({
    selector: 'app-ganador',
    templateUrl: './ganador.component.html',
    styleUrls: ['./ganador.component.css']
})
export class GanadorComponent implements OnInit {
    public winner;

    constructor(public _Socket: SocketService) {
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
        $(function () {
            $(".typed").typed({
                strings: ["AND THE WINNER IS ...<br><br> "],
                typeSpeed: 50,
                startDelay: 1200,
                backSpeed: 20,
                backDelay: 500,
                showCursor: false,
                onComplete: function () {
                    $(".dos").typed({
                        strings: [this.winner],
                        typeSpeed: 30,
                        backSpeed: 50,
                        backDelay: 500,
                        showCursor: false,

                    })
                }
            })
        })

    }

}
