// services/socketHandler.js

import { Server } from "socket.io";
import axios from "axios";

export default function (server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5000", // Match frontend port
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("createRoom", async (data, callback) => {
      const { token } = data;
      try {
        const response = await axios.post(
          "http://localhost:3000/database/api/room/create/",
          {},
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const roomId = response.data.roomId;
        socket.join(roomId);
        callback({ status: "ok", roomId });
      } catch (error) {
        console.error("Error creating room:", error.message);
        callback({ status: "error", error: "Failed to create or join room" });
      }
    });

    socket.on("joinRoom", async (data, callback) => {
      const { token, roomId } = data;
      try {
        const response = await axios.post(
          "http://localhost:3000/database/api/room/join/",
          { roomId: roomId },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        socket.join(roomId);
        callback({ status: "ok", roomId });
      } catch (error) {
        console.error("Error creating room:", error.message);
        callback({ status: "error", error: "Failed to create or join room" });
      }
      io.to(roomId).emit("members-updated");
    });

    socket.on("drawElement", async (newElement) => {
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

    socket.on("leave", async (data, callback) => {
      const { token, roomId } = data;
      try {
        axios.post(
          "http://localhost:3000/database/api/room/leave/",
          { roomId: roomId },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        callback({ status: "ok" });
        io.to(roomId).emit("members-updated");
      } catch {
        console.error("Error creating room:", error.message);
      }
    });
    socket.on("member-kicked", (data) => {
      const { roomId } = data;
      io.to(roomId).emit("members-updated");
    });
    socket.on("access-changed", (data) => {
      const { roomId } = data;
      io.to(roomId).emit("access-updated");
    });

    socket.on("code-changed", (data) => {
      socket.broadcast.emit("code-updated", data);
    });
    socket.on("code-response-changed", (data) => {
      socket.broadcast.emit("code-response-updated", data);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected"); // Optionally do cleanup here
    });
  });
}
