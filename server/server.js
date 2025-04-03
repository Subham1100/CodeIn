const express = require("express");
const app = express();
require("dotenv").config({ path: "../.env" });

const server = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("joinRoom", (data) => {
    const { name, userId, roomId, host, presenter } = data;
    console.log(data);
    socket.join(roomId);
    socket.emit("userIsJoined", { success: true, user: data });
  });

  socket.on("drawElement", (newElement) => {
    socket.broadcast.emit("updateCanvas", {
      type: "updateCanvas",
      element: newElement,
    });
  });

  socket.on("clearCanvas", (newElement) => {
    socket.broadcast.emit("updateClearCanvas", {
      type: "clearCanvas",
    });
  });
  socket.on("undoCanvas", (newElement) => {
    socket.broadcast.emit("updateUndoCanvas", {
      type: "undoCanvas",
    });
  });
  socket.on("redoCanvas", (newElement) => {
    socket.broadcast.emit("updateRedoCanvas", {
      type: "redoCanvas",
    });
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  console.log("user connected");
});

//routes
app.get("/", (req, res) => {
  res.send("this is whiteboard");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
