import { Server } from "socket.io";

const io = new Server(3001, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const rooms = {};

io.on("connection", (socket) => {
  let currentRoom = null;

  socket.on("join-room", (roomId) => {
    currentRoom = roomId;
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        currentTime: 0,
        isPlaying: false,
        listeners: 0,
      };
    }

    rooms[roomId].listeners++;

    socket.emit("room-state", rooms[roomId]);
    io.to(roomId).emit("listener-count", rooms[roomId].listeners);
  });

  socket.on("play", ({ roomId, currentTime }) => {
    rooms[roomId].isPlaying = true;
    rooms[roomId].currentTime = currentTime;
    io.to(roomId).emit("play", { currentTime });
  });

  socket.on("pause", ({ roomId, currentTime }) => {
    rooms[roomId].isPlaying = false;
    rooms[roomId].currentTime = currentTime;
    io.to(roomId).emit("pause", { currentTime });
  });

  socket.on("seek", ({ roomId, currentTime }) => {
    rooms[roomId].currentTime = currentTime;
    io.to(roomId).emit("seek", { currentTime });
  });

  socket.on("disconnect", () => {
    if (currentRoom && rooms[currentRoom]) {
      rooms[currentRoom].listeners--;
      io.to(currentRoom).emit("listener-count", rooms[currentRoom].listeners);
    }
  });
});

console.log("WebSocket server running on port 3001");
