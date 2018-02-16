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


const publicPath = path.join(__dirname, './public');
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
        table: "Quien madruga dios le ayuda"
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

        socket.join(userroom);
        socket.username = name;
        socket.room = userroom;
        roomNumber = userroom;
        let username = name;
        ++numUser;
        nameUser.push(name);


        game.push({
            name: socket.username,
            id: socket.id,
            room: userroom,
            numero: numUser,
            total: nameUser,
            primero: false
        });

        for (let player of game) {
            if (player.room == userroom) if (player.numero % 2 == 1) {
                player.primero = true;
                console.log(game);
                console.log(player);
                console.log("ESTE ES PRIMERO" + player.name)
            }
        }

        io.to(userroom).emit('connectToRoom', userroom);

        io.to(userroom).emit('user', {
            sala: roomno,
            numero: numUser,
            total: nameUser,
            name: username
        });
        socket.on('new-message', data => {
            io.to(userroom).emit('message', {
                name: username,
                msg: data
            });
        });

        let copyarray;

        socket.on('begin', () => {
            io.to(userroom).emit('test', game);
            copyarray = gameContent;


            socket.on('start-round', () => {
                //let selc = copyarray[Math.floor(Math.random() * (copyarray.lenght))];
                let selc = copyarray[0];
                io.to(userroom).emit('game', selc);
                selc = copyarray[0];
                copyarray.splice(copyarray.indexOf(selc), 1);
            });

        });
        socket.on('next', () => {
            for (let player of game) {
                if (player.room == userroom) player.primero = !player.primero;
            }
            player = game.filter(data => data.name == socket.username);
            console.log("busco esta" + player);
            io.to(userroom).emit('next', player)
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
