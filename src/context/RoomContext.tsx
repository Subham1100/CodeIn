import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSocket } from "./socketContext";

const API_URL = import.meta.env.VITE_API_URL;

type RoomContextType = {
  leaveRoom: (roomId: string) => void;
  kickMember: (roomId: string, username: string) => void;
  sendRoomCode: (roomId: string, code: string) => void;
  getRoomCode: (roomId: string) => Promise<string>;
  getRoomOutput: (roomId: string) => Promise<string>;
  sendRoomOutput: (roomId: string, expectedResponseUpdate: string) => void;
};

const RoomContext = createContext<RoomContextType | null>(null);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useSocket();
  const navigate = useNavigate();

  const leaveRoom = (roomId: string) => {
    const token = localStorage.getItem("token");
    socket.emit("leave", { roomId, token }, (res: any) => {
      // Optional: handle response
    });
    navigate("/rooms");
  };

  const kickMember = (roomId: string, username: string) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`${API_URL}/database/api/room/kick`, {
        headers: { Authorization: token },
        data: { roomId, username },
      })
      .catch((err) => console.error(err));

    socket.emit("member-kicked", { roomId });
  };

  const sendRoomCode = async (roomId: string, code: string) => {
    const token = localStorage.getItem("token");
    const authenticationHeader = {
      Authorization: token,
    };
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/database/api/room/roomCode`,
        { roomId: roomId, roomCode: code },
        {
          headers: authenticationHeader,
        }
      );
      return response.data;
    } catch (error) {}
  };

  const getRoomCode = async (roomId: string) => {
    const token = localStorage.getItem("token");
    const authenticationHeader = {
      Authorization: token,
    };
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/database/api/room/roomCode`,
        {
          params: {
            roomId: roomId,
          },
          headers: authenticationHeader,
        }
      );
      return response.data.roomCode;
    } catch (error) {
      return "";
    }
  };
  const getRoomOutput = async (roomId: string) => {
    const token = localStorage.getItem("token");
    const authenticationHeader = {
      Authorization: token,
    };
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/database/api/room/roomOutput`,
        {
          params: {
            roomId: roomId,
          },
          headers: authenticationHeader,
        }
      );
      return response.data.roomOutput;
    } catch (error) {}
  };
  const sendRoomOutput = async (
    roomId: string,
    expectedResponseUpdate: string
  ) => {
    const token = localStorage.getItem("token");
    const authenticationHeader = {
      Authorization: token,
    };
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/database/api/room/roomOutput`,
        { roomId: roomId, roomOutput: expectedResponseUpdate },
        {
          headers: authenticationHeader,
        }
      );
      return response.data;
    } catch (error) {}
  };

  return (
    <RoomContext.Provider
      value={{
        leaveRoom,
        kickMember,
        sendRoomCode,
        getRoomCode,
        getRoomOutput,
        sendRoomOutput,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRoom must be used inside RoomProvider");
  return ctx;
};
