"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var socket_io_1 = require("socket.io");
// Create an Express app
var app = (0, express_1.default)();
var server = (0, http_1.createServer)(app);
// Create a Socket.IO server with CORS enabled for all hosts
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
app.get("/health", function (req, res) {
    res.send("v1.2");
});
// ----------
// Heartbeat
// ----------
var heartbeatInterval;
if (heartbeatInterval)
    clearInterval(heartbeatInterval);
heartbeatInterval = setInterval(function () {
    io.emit("heartbeat");
}, 2000);
// ----------
io.on("connection", function (socket) {
    console.log("connected");
    socket.on("offer", function (data) { return socket.broadcast.emit("offer", data); });
    socket.on("answer", function (data) { return socket.broadcast.emit("answer", data); });
    socket.on("iceCandidate", function (data) {
        return socket.broadcast.emit("iceCandidate", data);
    });
    socket.on("disconnect", function () { return console.log("disconnected"); });
});
var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log("Server listening on port ".concat(port));
});
