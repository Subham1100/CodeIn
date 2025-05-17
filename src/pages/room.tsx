import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/socketContext.tsx";
import { logEvent, LogLevel } from "../utils/logger";
import axios from "axios";

import Feature from "../components/feature";

const Room = () => {
  const [placeholderName, setplaceholderName] = useState("Enter Name");
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

  return (
    <div className="px-[100px] py-[50px] pb-[100px] flex flex-col gap-[50px] animate-flip-vertical animate-slide-in bg-[#F0E0B9] ">
      <Feature
        title={"Join Room"}
        image_src="../../public/images/join_room.jpeg"
        description={
          <div className="flex flex-col gap-5 w-[75%] max-w-[30vw]">
            <input
              id="name"
              placeholder={placeholderName}
              className="bg-white rounded-2xl p-2 focus:outline-none"
              onChange={(e) => setplaceholderName(e.target.value)}
              onBlur={() => {
                if (placeholderName.trim() === "") {
                  setplaceholderName("Enter Name");
                }
              }}
              onFocus={() => {
                if (placeholderName === "Enter Name") {
                  setplaceholderName("");
                }
              }}
            />
            <input
              id="room_code"
              placeholder={placeholderRoomId}
              className="bg-white rounded-2xl p-2 focus:outline-none"
              onChange={(e) => setplaceholderRoomId(e.target.value)}
              onBlur={() => {
                if (placeholderRoomId.trim() === "") {
                  setplaceholderRoomId("Enter Name");
                }
              }}
              onFocus={() => {
                if (placeholderRoomId === "Enter Name") {
                  setplaceholderRoomId("");
                }
              }}
            />
            <button
              className="bg-black text-white rounded-xl p-2"
              onClick={handleJoin}
            >
              Join
            </button>
          </div>
        }
      />
      <Feature
        title={"Create Room"}
        image_src="../../public/images/create_room.jpg"
        flip={true}
        description={
          <div className="flex flex-col gap-5 w-[75%] max-w-[30vw]">
            <input
              id="name"
              placeholder={placeholderName}
              className="bg-white rounded-2xl p-2 focus:outline-none"
              onChange={(e) => setplaceholderName(e.target.value)}
              onBlur={() => {
                if (placeholderName.trim() === "") {
                  setplaceholderName("Enter Name"); // ✅ Restore text only if empty
                }
              }}
              onFocus={() => {
                if (placeholderName === "Enter Name") {
                  setplaceholderName(""); // ✅ Clear only if it was the default text
                }
              }}
            />
            <button
              className="bg-black text-white rounded-xl p-2"
              onClick={handleCreate}
            >
              Create
            </button>
          </div>
        }
      />
    </div>
  );
};

export default Room;
