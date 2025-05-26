// services/socketHandler.js

import { Server } from "socket.io";
import axios from "axios";
import path from "path";
import dotenv from "dotenv";
import { Edit } from "lucide-react";
import { data } from "react-router-dom";
const envPath = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "../../.env"
);

dotenv.config({ path: envPath });
const allowedOrigins = [
  "https://whiteboard-liart-phi.vercel.app",
  "https://whiteboard-git-main-subham1100s-projects.vercel.app",
  "https://whiteboard-lc1uwhja8-subham1100s-projects.vercel.app",
  "https://whiteboard-subham1100s-projects.vercel.app",
  "http://localhost:5000",
];

export default function (server) {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins, // Match frontend port
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("createRoom", async (data, callback) => {
      const { token } = data;
      try {
        const response = await axios.post(
          `${process.env.API_URL}/database/api/room/create/`,
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
          `${process.env.API_URL}/database/api/room/join/`,
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

    socket.on("whiteboardChanged", async (data) => {
      const { changes } = data;

      socket.broadcast.emit("whiteboardUpdated", changes);
    });

    socket.on("leave", async (data, callback) => {
      const { token, roomId } = data;
      try {
        axios.post(
          `${process.env.API_URL}/database/api/room/leave/`,
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
