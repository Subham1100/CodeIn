import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import HomePage from "./pages/homepage";
import Rooms from "./pages/room";
import { Whiteboard } from "./pages";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:roomId" element={<Whiteboard />} />
      </Routes>
    </Router>
  );
}

export default App;
