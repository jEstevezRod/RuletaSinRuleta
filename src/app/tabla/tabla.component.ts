import {Component, OnInit} from '@angular/core';
import {SocketService} from "../socket.service";

declare var jquery: any;
declare var $: any;

@Component({
    selector: 'app-tabla',
    templateUrl: './tabla.component.html',
    styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {
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


    constructor(public _Socket: SocketService) {

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
            this.cajasarray = [];
            this.response = data;
            for (let caja of this.response.table) {
                this.cajasarray.push(caja)
            }

            $('#botonbegin').hide()
        });

        this._Socket.test$.subscribe(data => {
            this.GlobalPlayers = data;
            console.log(this.GlobalPlayers);
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
                $('app-caja').filter(function () {
                        if (data == $(this).text().toLowerCase().trim()) {

                            $(this).addClass('text-noIndent')
                        }
                    }
                );
            }
        )
    }



    startGame() {
        this._Socket.startGame();
    }

    begin() {
        this._Socket.begin();
    }

    check(solucion) {
        this._Socket.check(solucion.trim());
        this.solucion = '';
    }

    nextTurn() {
        this._Socket.nextTurn()
    }
}
