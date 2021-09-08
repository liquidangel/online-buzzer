const socket = io();
const body = document.querySelector('.buzzerBody');
const form = document.querySelector('.buzzerJoin');
const joined = document.querySelector('.buzzerJoined');
const buzzer = document.querySelector('.btnBuzzer');
const joinedInfo = document.querySelector('.buzzerJoined-info');
const errMsg = document.querySelector('.lblErrorMsg');

let user = {};

const getUserInfo = () => {
  user = JSON.parse(localStorage.getItem('user')) || {};
  if(user.name) {
    form.querySelector('[name=name]').value = user.name
  }
}

const saveUserInfo = () => {
  localStorage.setItem('user', JSON.stringify(user));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  user.name = form.querySelector('[name=name]').value;
  if(users.indexOf(user.name) != -1) {
    errMsg.innerHTML = "Username already in use!";
    errMsg.classList.remove('hidden');
    return false;
  }
  errMsg.innerHTML = "";
  errMsg.classList.add('hidden');
  socket.emit('join', user);
  saveUserInfo();
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
  if(users.indexOf(user.name)) {
    location.href = "/";
  }
})


getUserInfo();