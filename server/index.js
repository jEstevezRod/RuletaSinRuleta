let expreslet
express = require('express')
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 3000;

let numUser = 0;
let nameUser = [];
var roomno = 1
let GlobalPlayers = [];
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


    socket.on('new-user', (name) => {


        if (io.nsps['/'].adapter.rooms["room-" + roomno] && io.nsps['/'].adapter.rooms["room-" + roomno].length > 1) {
            roomno++
        }
        let userroom = "room-" + roomno;
        let username = name;

        socket.join(userroom);

        io.to(userroom).emit('connectToRoom', userroom);

        GlobalPlayers.push({name: username, room: userroom})
        ++numUser;
        nameUser.push(name);

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
        socket.on('begin', () => {
            io.to(userroom).emit('test', GlobalPlayers)
        });
        let copyarray = gameContent;

        socket.on('start-round', () => {
            // let selc = copyarray[Math.floor(Math.random() * (copyarray.lenght + 1))];
            let selc = copyarray[0];
            copyarray.splice(copyarray.indexOf(selc), 1);
            io.to(userroom).emit('game', selc);
            console.log("ESTA ES LA UNDEFINED " + (selc))
        })
    });
    socket.on('disconnect', function (msg) {
        --numUser;
        console.log("Se ha desconectado el usuario " + socket.username);
        if (nameUser.length > 1) {
            nameUser.splice(nameUser.indexOf(socket.username), 1);
        }
        socket.broadcast.emit('user', {
            numero: numUser,
            total: nameUser,
        })
    });
});

