const express = require('express');
const http = require('http');
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

app.use(express.static('public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index', {title}));
app.get('/host', (req, res) => res.render('host', Object.assign({ title }, getData())));

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});