const socket = io();
const body = document.querySelector('.buzzerBody');
const form = document.querySelector('.buzzerJoin');
const joined = document.querySelector('.buzzerJoined');
const buzzer = document.querySelector('.btnBuzzer');
const joinedInfo = document.querySelector('.buzzerJoined-info');
const errMsg = document.querySelector('.lblErrorMsg');

let user = {};
let userList = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  user.name = form.querySelector('[name=name]').value;
  if(userList.indexOf(user.name.toUpperCase()) != -1) {
    console.log('Username is in use');
    errMsg.innerHTML = "Username already in use!";
    errMsg.classList.remove('hidden');
    return false;
  }
  errMsg.innerHTML = "";
  errMsg.classList.add('hidden');
  socket.emit('join', user);
  // saveUserInfo();
  joinedInfo.innerText = `${user.name}`;
  form.classList.add('hidden');
  joined.classList.remove('hidden');
  body.classList.add('buzzer-mode');
});

buzzer.addEventListener('click', (e) => {
  socket.emit('buzz', user);
});

socket.on('exitUser', (users) => {
  socket.emit('pingUser', {user: user.name});
  location.href = "/";
});

socket.on('kickUser', (kickUser) => {
  console.log('kickUser', kickUser);
  if(user.name == kickUser) {
    location.href = "/";
  }
})

socket.on('active', (users) => {
  userList = users.map(function(user) {
    return user.toUpperCase();
  });
  console.log('AvtiveUsers', userList);
})

socket.on('sendUsers', (users) => {
  userList = users.map(function(user) {
    return user.toUpperCase();
  });
  console.log('UserList', userList);
})

var getUsers = function() {
  socket.emit('getUsers');
  console.log('onload');
}