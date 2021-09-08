const socket = io();
const active = document.querySelector(".buzzActive");
const buzzList = document.querySelector(".buzzList");
const userList = document.querySelector(".userList");
const clear = document.querySelector(".btnClear");
const clearUsers = document.querySelector(".btnClearUsers");
const kickUser = document.querySelector(".btnKickUser");

socket.on("active", (users) => {
  active.innerText = `${users.length} users joined`;
  userList.innerHTML = users.map(user => `<li>${user}</li>`).join('');
});

socket.on("buzzes", (buzzes) => {
  buzzList.innerHTML = buzzes.map(buzz => `<li>${buzz}</li>`).join('');
})

clear.addEventListener('click', () => {
  socket.emit("clear");
})

kickUser.addEventListener('click', () => {
  console.log('Kick Clicked');
  socket.emit('kick', 'Paulo');
})

clearUsers.addEventListener('click', () => {
  socket.emit("clearUsers");
  socket.emit('clear');
})