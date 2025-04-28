// services/socketHandler.js

const { Server } = require("socket.io");

module.exports = function (server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5000", // Match frontend port
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (data) => {
      const { name, userId, roomId, host, presenter } = data;
      socket.join(roomId);
    });

    socket.on("drawElement", (newElement) => {
      socket.broadcast.emit("updateCanvas", {
        type: "updateCanvas",
        element: newElement,
      });
    });

    socket.on("clearCanvas", () => {
      socket.broadcast.emit("updateClearCanvas", { type: "clearCanvas" });
    });

    socket.on("undoCanvas", () => {
      socket.broadcast.emit("updateUndoCanvas", { type: "undoCanvas" });
    });

    socket.on("redoCanvas", () => {
      socket.broadcast.emit("updateRedoCanvas", { type: "redoCanvas" });
    });

    socket.on("disconnect", () => {
      // Handle user disconnect
    });
  });
};
