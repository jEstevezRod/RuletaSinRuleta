import {Component, OnInit} from '@angular/core';
import {SocketService} from "../socket.service";
import {Router} from "@angular/router";

declare var jquery: any;
declare var $: any;

@Component({
    selector: 'app-tabla',
    templateUrl: './tabla.component.html',
    styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {
    solucionfinal: string;
    public tip: any;
    public GlobalPlayers;
    public currentRoom: any;
    public currentPlayer;
    public turno = false;
    public name;
    public cajasarray = [];
    public response;
    public playersOnRoom = true;
    public contador = 0;
    public solucion: string;
    public nombres = [];
    public puntuacion;
    public showpuntuaciones = [];
    public varr;
    public escondido = true;


    constructor(public _Socket: SocketService, public router: Router) {

    }

    ngOnInit() {
        this.begin();

        this._Socket.nuevoUsuario$.subscribe(data => this.currentPlayer = data);

        if (!this.currentPlayer) this.currentPlayer = this._Socket.currentPlayerBackup;

        this._Socket.roomInfo$.subscribe(data => this.currentRoom = data);

        if (!this.currentRoom) {
            this.currentRoom = this._Socket.currentRoomBackup;
        }

        this._Socket.questions$.subscribe(data => {
            this.escondido = false;
            this.cajasarray = [];
            this.response = data;
            for (let caja of this.response.table) {
                this.cajasarray.push(caja)
            }

            $('#botonbegin').hide()
        });

        this._Socket.test$.subscribe(data => {
            this.GlobalPlayers = data;
            for (let index of this.GlobalPlayers) {
                if (index.room == this.currentRoom) {
                    ++this.contador;
                    if (this.nombres.indexOf(index.name)) this.nombres.push(index.name);

                }
                if (this.contador > 1) {
                    this.playersOnRoom = false;
                    $('#needmore').hide();
                }
            }
            let user = this.GlobalPlayers.filter(data => data.name == this._Socket.miusuario);
            this.turno = !user[0].primero;
        });
        this._Socket.turn$.subscribe(data => {
                this.GlobalPlayers = data;
                let user = this.GlobalPlayers.filter(data => data.name == this._Socket.miusuario);
                this.turno = !user[0].primero;
            }
        );

        this._Socket.answer$.subscribe(data => {
                this.varr = $('app-caja').filter(function () {
                        if (data == $(this).text().toLowerCase().trim()) {
                            $(this).addClass('text-noIndent');
                            return true
                        }
                    }
                ).length;
            }
        );

        this._Socket.puntuacion$.subscribe(data => {
                this.GlobalPlayers = data;
                this.showpuntuaciones = this.GlobalPlayers.filter(data => data.room == this.currentRoom);
                console.log(this.showpuntuaciones);

            }
        );

        this._Socket.ganador$.subscribe(data => {
            this.router.navigate(['/ganador']);
            this.escondido = true;
        });

        this._Socket.ragequit$.subscribe(data => {
            this.router.navigate([''])
        })
    }


    startGame() {
        this._Socket.startGame();
    }

    begin() {
        this._Socket.begin();
    }

    check(solucion) {
        this._Socket.check(solucion.trim());
        this._Socket.socket.on('sumapuntos', data => this.plusPuntuation(this.varr));
        this.solucion = '';

    }

    checksolution(solucion) {
        this._Socket.chechsolution(solucion.trim());
        this.solucionfinal = "";
    }

    nextTurn() {
        //this.plusPuntuation(this.varr);
        this._Socket.nextTurn();
    }

    plusPuntuation(canti) {
        this._Socket.plusPuntuation(canti)
    }
}
