const express = require('express');
const http = require('http');
const { SocketAddress } = require('net');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const title = 'Buzzer Beater';

let data = {
  users: new Set(),
  buzzes: new Set()
}

const getData = () => ({
  users: [...data.users],
  buzzes: [...data.buzzes]
});

const getUsers = () => ({
  users: [...data.users]
});

app.use(express.static('public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index', Object.assign({ title }, getUsers())));
app.get('/host', (req, res) => res.render('host', Object.assign({ title }, getData())));

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('join', (user) => {
    data.users.add(user.name);
    io.emit('active', [...data.users]);
    console.log(`${user.name} joined!`);
  });
  socket.on('buzz', (user) => {
    if(data.users.has(user.name)) {
      data.buzzes.add(user.name);
      io.emit('buzzes', [...data.buzzes]);
      console.log(`${user.name} buzzed in!!!`);
    } else {
      console.log('user already kicked out');
    }
  });
  socket.on('clear', () => {
    data.buzzes = new Set();
    io.emit('buzzes', [...data.buzzes]);    
    console.log('buzzes cleared.', data.buzzes);
  });
  socket.on('clearUsers', () => {
    io.emit('exitUser');
    data.users = new Set();
    io.emit('active', [...data.users]); 
    console.log('users cleared');
  });
  socket.on('kick', (user) => {
    console.log('Kick', user);
    io.emit('kickUser', user);
  })
  socket.on('pingUser', (user) => {
    console.log('User:', user);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});