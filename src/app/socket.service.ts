import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Subject} from "rxjs/Subject";
import {environment} from "../environments/environment";

@Injectable()
export class SocketService {


    public socket;
    public miusuario = '';
    public currentPlayerBackup;
    public currentRoomBackup;

    public nuevoUsuario = new Subject();
    public nuevoUsuario$ = this.nuevoUsuario.asObservable();

    public roomInfoSource = new Subject();
    public roomInfo$ = this.roomInfoSource.asObservable();

    public messageSource = new Subject();
    public message$ = this.messageSource.asObservable();

    public questionsSource = new Subject();
    public questions$ = this.questionsSource.asObservable();

    public testSource = new Subject();
    public test$ = this.testSource.asObservable();

    public answerSource = new Subject();
    public answer$ = this.answerSource.asObservable();

    public turnSource = new Subject();
    public turn$ = this.turnSource.asObservable();

    private url = environment.serverSocket;

    constructor() {
        this.socket = io(this.url);

        this.socket.on('user', (data) => {
            this.nuevoUsuario.next(data);
            this.currentPlayerBackup = data;
        });
        this.socket.on('connectToRoom', (data) => {
            this.roomInfoSource.next(data);
            this.currentRoomBackup = data;
        });
        this.socket.on('message', (data) => this.messageSource.next(data));

        this.socket.on('game', (data) => this.questionsSource.next(data));

        this.socket.on('test', data => this.testSource.next(data));

        this.socket.on('answer', data => this.answerSource.next(data));

        this.socket.on('next', data => this.turnSource.next(data))
    }

    nextTurn() {
        this.socket.emit('next', this.miusuario)
    }

    newUser(data) {
        this.socket.emit('new-user', data);
        this.miusuario = data;
    }

    sendMessage(mensaje: any) {
        this.socket.emit('new-message', mensaje)
    }

    startGame() {
        this.socket.emit('start-round')
    }

    begin() {
        this.socket.emit('begin')
    }

    check(letra) {
        this.socket.emit('response', letra)
    }
}


