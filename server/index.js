// let express = require('express')
// let app = express();
//
// let http = require('http');
// let server = http.Server(app);
//
// let socketIO = require('socket.io');
// let io = socketIO(server);
//
// const port = process.env.PORT || 3000;
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const publicPath = path.join(__dirname, 'public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

let numUser = 0;
let nameUser = [];
var roomno = 1;
let game = [];
var cont = 0;
const gameContent = [
    {
        tip: "Dicho mañanero",
        table: "A quien madruga dios le ayuda"
    },
    {
        tip: "Comida valencia",
        table: "Paella valenciana"
    },
    {
        tip: "Nombre del abuelo de heidi",
        table: "Herman Hessen"
    }
];

server.listen(port, () => {
    console.log(`started on port: ${port}`);
});


io.on('connection', (socket) => {
    console.log('user connected');

    let roomNumber;

    socket.on('new-user', (name) => {
        if (io.nsps['/'].adapter.rooms["room-" + roomno] && io.nsps['/'].adapter.rooms["room-" + roomno].length > 1) roomno++;

        let userroom = "room-" + roomno;
        let username = name;
        ++numUser;


        socket.join(userroom);
        socket.username = name;
        socket.sala = userroom;
        socket.numero = numUser;
        socket.primero = false;
        socket.puntuacion = 0;
        roomNumber = userroom;
        nameUser.push(name);

        console.log("Se ha conectado el jugador " + socket.username);
        console.log("Se encuentra en la sala " + socket.sala);
        console.log("Tiene el numero  " + socket.numero);
        console.log("Se encuentra en el servidor los siguientes jugadores " + nameUser);


        if (socket.numero % 2 == 1) {
            socket.primero = true;
        }

        game.push({
            name: socket.username,
            id: socket.id,
            room: socket.sala,
            numero: socket.numero,
            primero: socket.primero,
            total: nameUser,
            puntuacion: socket.puntuacion
        });


        io.to(userroom).emit('connectToRoom', socket.sala);

        io.to(userroom).emit('user', {
            sala: roomno,
            numero: numUser,
            total: nameUser,
            name: username
        });
        socket.on('new-message', data => {
            io.to(userroom).emit('message', {
                name: socket.username,
                msg: data
            });
        });


        socket.on('begin', () => {
            io.to(userroom).emit('test', game);
        });


        socket.on('start-round', () => {
            io.to(userroom).emit('game', gameContent[cont]);
        });

        socket.on('next', () => {
            for (let player of game) {
                if (player.room == userroom) {
                    player.primero = !player.primero;
                }
            }
            io.to(userroom).emit('next', game)
        });

        socket.on('response', data => {
            //socket.to(userroom).broadcast('answer', data);
            io.to(userroom).emit('answer', data);
            socket.emit('sumapuntos', data);
        });

        socket.on('respuesta', data => {
            if (data.trim().toLowerCase() == gameContent[cont].table.toLowerCase()) {
                let objIndex = game.findIndex(obj => obj.name == socket.username);
                io.to(userroom).emit('ganador', game[objIndex])
                cont = cont + 1;
                if (cont >= gameContent.length) cont = 0;
            } else {
                let objIndex = game.findIndex(obj => obj.name === socket.username);
                game[objIndex].puntuacion /= 2;
                io.to(userroom).emit('puntuacion', game)
            }

        });
        socket.on('sumar', data => {
            for (let player of game) {
                if (player.room == userroom && player.name == username && player.primero == false) {
                    player.puntuacion += data * 50;
                }
            }
            io.to(userroom).emit('puntuacion', game)
        });

        socket.on('back', () => {
            for (let player of game) {
                if (player.room == userroom) {
                    player.puntuacion = 0;
                }
            }
            io.to(userroom).emit('home', game)
        })

    });

    socket.on('disconnect', () => {
        --numUser;
        console.log("Se ha desconectado el usuario " + socket.username);
        game = game.filter(data => data.room !== roomNumber);
        io.to(roomNumber).emit('user', game);
        io.to(roomNumber).emit('ragequit', game);
    });
});
