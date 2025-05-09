import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { Homepage, Rooms, CodeIn, Auth } from "./pages";
import "./App.css";
import { SocketProvider } from "../src/hooks/socketContext";

function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:roomId" element={<CodeIn />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
