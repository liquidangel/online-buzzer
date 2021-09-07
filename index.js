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
  buzzes: [...data.buzzes].map(b => {
    const [name, id] = b.split('-');
    return {name, id};
  })
});

const getUsers = () => ({
  users: [...data.users]
});

app.use(express.static('public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index', Object.assign({title}, getUsers())));
app.get('/host', (req, res) => res.render('host', Object.assign({ title }, getData())));

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('join', (user) => {
    data.users.add(user.name);
    io.emit('active', [...data.users].length);
    console.log(`${user.name} joined!`);
  });
  socket.on('buzz', (user) => {
    data.buzzes.add(user.name);
    console.log(data.buzzes);
    io.emit('buzzes', [...data.buzzes]);
    console.log(`${user.name} buzzed in!!!`);
  });
  socket.on('clear', () => {
    data.buzzes = new Set();
    io.emit('buzzes', [...data.buzzess]);
    console.log('buzzes cleared.');
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});