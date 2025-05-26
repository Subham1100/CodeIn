import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../hooks/socketContext";
import { logEvent, LogLevel } from "../utils/logger";

import TempCanvas from "./tempCanvas";
const TempWhiteboard = () => {
  const { roomId } = useParams();
  const socket = useSocket();

  useEffect(() => {
    if (!roomId || !socket.connected) {
      logEvent(
        "RoomOrSocketNotReady",
        { roomId, socketConnected: socket.connected },
        LogLevel.WARN
      );
      return;
    }

    socket.on("userIsJoined", (data) => {
      if (data.success) {
        logEvent("UserJoinedRoom", { roomId, user: data.user }, LogLevel.INFO);
      } else {
        logEvent(
          "UserJoinError",
          { roomId, user: data.user, error: data.error || "No error provided" },
          LogLevel.ERROR
        );
      }
    });

    return () => {
      socket.off("userIsJoined");
    };
  }, [roomId, socket]);

  return (
    <div id="canvas_container">
      <TempCanvas />
    </div>
  );
};

export default TempWhiteboard;
