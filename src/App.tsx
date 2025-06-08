import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Homepage, Rooms, CodeIn, Auth, TempHomepage } from "./pages";
import "./App.css";
import { SocketProvider } from "./context/socketContext";
import { RoomProvider } from "./context/RoomContext";

function App() {
  return (
    <SocketProvider>
      <RoomProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:roomId" element={<CodeIn />} />
        </Routes>
      </RoomProvider>
    </SocketProvider>
  );
}

export default App;
