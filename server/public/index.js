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
let arr = [];
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
        let copyarray = [];
        ++numUser;


        socket.join(userroom);
        socket.username = name;
        socket.sala = userroom;
        socket.numero = numUser;
        socket.primero = false;
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
            total: nameUser
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
            copyarray = gameContent;
        });

        socket.on('start-round', () => {
            let selc = copyarray[0];
            io.to(userroom).emit('game', selc);
            selc = copyarray[0];
            copyarray.splice(copyarray.indexOf(selc), 1);

        });

        socket.on('next', () => {
            for (let player of game) {
                if (player.room = userroom) {
                    player.primero = !player.primero;
                }
            }
            /*
                        let player = game.filter(data => data.name == username);
            */
            io.to(userroom).emit('next', game)
        });

        socket.on('response', data => {
            io.to(userroom).emit('answer', data)
        })
    });

    socket.on('disconnect', () => {
        --numUser;
        console.log("Se ha desconectado el usuario " + socket.username);
        nameUser.splice(nameUser.indexOf(socket.username), 1);
        game = game.filter(data => data.name !== socket.username);
        console.log(game);
        io.to(roomNumber).emit('user', game)
    });
});