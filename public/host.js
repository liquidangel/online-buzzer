const socket = io();
const active = document.querySelector(".buzzActive");
const buzzList = document.querySelector(".buzzList");
const userList = document.querySelector(".userList");
const clear = document.querySelector(".btnClear");
const clearUsers = document.querySelector(".btnClearUsers");

socket.on("active", (users) => {
  active.innerText = `${users.length} users joined`;
  userList.innerHTML = users.map(user => `<li><a href="#" onclick="kickUser('${user}')">${user}</a></li>`).join('');
});

socket.on("buzzes", (buzzes) => {
  buzzList.innerHTML = buzzes.map(buzz => `<li>${buzz}</li>`).join('');
})

clear.addEventListener('click', () => {
  socket.emit("clear");
})

// kickUser.addEventListener('click', () => {
//   console.log('Kick Clicked');
//   socket.emit('kick', 'Paulo');
// })

var kickUser = function(user) {
  socket.emit('kick', user);
}

clearUsers.addEventListener('click', () => {
  socket.emit("clearUsers");
  socket.emit('clear');
})