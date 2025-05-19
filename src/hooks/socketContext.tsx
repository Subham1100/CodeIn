import React, { createContext, useContext } from "react";
import { io, Socket } from "socket.io-client";

const server = import.meta.env.VITE_API;

// Create socket instance
const socket: Socket = io(server, {
  reconnectionDelayMax: 10000,
  transports: ["websocket"],
  auth: {
    token: "123",
  },
  query: {
    "my-key": "my-value",
  },
  path: "/socket.io",
});

// Create Context
const SocketContext = createContext<Socket | null>(null);

// Provider Component
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Custom Hook to use Socket
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useSocket must be used within a SocketProvider");
  return context;
};
