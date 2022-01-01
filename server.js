const port = 3000;
const io = require("socket.io")(port);

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    if (name == null) {
      return;
    }
    console.log(name + " joined");
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    const data = { name: users[socket.id], message: message };
    socket.broadcast.emit("receive", data);
  });

  socket.on("disconnect", () => {
    if (users[socket.id] == null) {
      return;
    }
    console.log(users[socket.id] + " left");
    socket.broadcast.emit("disconnected", users[socket.id]);
    delete users[socket.id];
  });
});

console.log(`Server is running at port ${port}`);
