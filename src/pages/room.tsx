import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/socketContext.tsx";
import { logEvent, LogLevel } from "../utils/logger";
import axios from "axios";

const Room = () => {
  const [placeholderRoomId, setplaceholderRoomId] = useState("Room Code");

  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCreate = () => {
    const token = localStorage.getItem("token");
    const roomData = {
      token: token,
    };
    socket.emit(
      "createRoom",
      roomData,
      (response: { status: string; roomId?: string; error?: string }) => {
        if (response.status === "ok") {
          logEvent("Successfully joined room", roomData, LogLevel.INFO);
          navigate(`/rooms/${response.roomId}`);
        } else {
          logEvent("Failed to join room", response.error, LogLevel.ERROR);
          alert("Failed to join room: " + response.error); // optional: user feedback
        }
      }
    );
  };

  const handleJoin = () => {
    const token = localStorage.getItem("token");
    const RoomId = placeholderRoomId;
    const roomData = {
      token: token,
      roomId: RoomId,
    };
    logEvent("Joining Room", roomData, LogLevel.INFO);

    socket.emit(
      "joinRoom",
      roomData,
      (response: { status: string; error?: string }) => {
        if (response.status === "ok") {
          logEvent("Successfully joined room", roomData, LogLevel.INFO);
          navigate(`/rooms/${RoomId}`);
        } else {
          logEvent(
            "Failed to join room",
            { roomData, error: response.error },
            LogLevel.ERROR
          );
          alert(`Error joining room: ${response.error}`);
        }
      }
    );
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Make the authenticated request
      const authenticationHeader = {
        Authorization: token,
      };

      axios
        .get(`${import.meta.env.VITE_API_URL}/database/api/user/profile/`, {
          headers: authenticationHeader,
        })
        .then((response) => {
          setUser(response.data.user);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setIsAuthenticated(false);
        });
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (!isAuthenticated) {
    return <div style={{ backgroundColor: "white", height: "100vh" }}></div>;
  }
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    handleJoin();
  };

  return (
    <div className=" relative p-6  bg-gradient-to-b from-[#faf0e6] via-[#faf0e6]  to-[#ba96a6] min-h-screen flex flex-col items-center justify-center">
      <p className="mb-10 text-7xl">CodeIn</p>

      <div className="room-options flex flex-col w-full max-w-md gap-5 bg-[#4b3b42] p-6 rounded-2xl justify-center items-center">
        <p className=" text-3xl font-bold text-gray-200">Room</p>
        <form onSubmit={handleSubmit}>
          <input
            className="bg-white  focus:outline-none rounded-2xl p-4"
            onChange={(event) => {
              setplaceholderRoomId(event.target.value);
            }}
          ></input>
        </form>
        <button
          className="bg-black text-white rounded-xl w-1/2 p-2"
          onClick={handleJoin}
        >
          Join
        </button>
        <button
          className="bg-black text-white rounded-xl w-1/2 p-2"
          onClick={handleCreate}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default Room;
