let express = require('express')
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 3000;

let numUser = 0;
let nameUser = [];

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('new-user', (name) => {
    socket.username = name;
    ++numUser;
    nameUser.push(name);
    socket.emit('user', {
      numero: numUser,
      total: nameUser,
      name: socket.username
    });
    console.log(name)
  })
});

server.listen(port, () => {
  console.log(`started on port: ${port}`);
});
