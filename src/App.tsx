import { Routes, Route } from "react-router-dom";
import { Homepage, Rooms, CodeIn, Auth, Docs } from "./pages";
import "./App.css";
import { SocketProvider } from "./context/socketContext";
import { RoomProvider } from "./context/RoomContext";
import { ReactLenis } from "lenis/react";

function App() {
  return (
    <SocketProvider>
      <RoomProvider>
        <ReactLenis root />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:roomId" element={<CodeIn />} />
          <Route path="/docs" element={<Docs />} />
        </Routes>
      </RoomProvider>
    </SocketProvider>
  );
}

export default App;
