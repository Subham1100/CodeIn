const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);

io.on("connection", (socket) => {
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
