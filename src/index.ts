import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

// Create an Express app
const app = express();
const server = createServer(app);

// Create a Socket.IO server with CORS enabled for all hosts
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/v", (req, res) => {
  res.send("v1.3");
});

io.on("connection", (socket: Socket) => {
  console.log("connected");

  socket.on("offer", (data) => socket.broadcast.emit("offer", data));

  socket.on("answer", (data) => socket.broadcast.emit("answer", data));

  socket.on("iceCandidate", (data) =>
    socket.broadcast.emit("iceCandidate", data)
  );

  socket.on("disconnect", () => console.log("disconnected"));
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
