// hooks/useRoomInfo.js
import { useEffect, useState } from "react";
import axios from "axios";
import { Socket } from "socket.io-client";

export const userRoomInfo = (roomId?: string, socket?: Socket) => {
  if (!roomId || !socket) return;
  const [roomInfo, setRoomInfo] = useState({
    members: [],
    host: "",
    currUser: "",
  });
  const [inRoom, setInRoom] = useState(true);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/database/api/room/members?roomId=${roomId}`,
        {
          headers: { Authorization: token },
        }
      );
      setRoomInfo(response.data);
      setInRoom(true);
    } catch (err) {
      setInRoom(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMembers();
    socket.on("members-updated", fetchMembers);
  }, []);

  return { roomInfo, inRoom };
};
