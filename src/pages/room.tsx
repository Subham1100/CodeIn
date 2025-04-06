import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/socketContext.tsx";
import { logEvent, LogLevel } from "../utils/logger";

import Feature from "../components/feature";

const Room = () => {
  const [placeholderName, setplaceholderName] = useState("Enter Name");
  const [placeholderRoomId, setplaceholderRoomId] = useState("Room Code");

  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const roomIds: number[] = [];

  const generateRoomCode = (): number => {
    const min = 1000;
    const max = 9999;
    let RoomId: number;

    do {
      RoomId = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (roomIds.includes(RoomId));

    roomIds.push(RoomId);
    return RoomId;
  };

  const generateUuid = (): string => {
    const randomLetter = String.fromCharCode(
      97 + Math.floor(Math.random() * 26)
    ); // 'a' to 'z'
    const randomNumber = Math.floor(1 + Math.random() * 99999999); // 1 to 100000000
    return `${randomLetter}${randomNumber}`;
  };

  const handleCreate = () => {
    const RoomId = generateRoomCode();
    const uuid = generateUuid();
    const roomData = {
      name: placeholderName,
      userId: uuid,
      roomId: RoomId,
      host: true,
      presenter: false,
    };
    socket.emit(
      "joinRoom",
      roomData,
      (response: { status: string; error?: string }) => {
        if (response.status === "ok") {
          logEvent("Successfully joined room", roomData, LogLevel.INFO);
          navigate(`/rooms/${RoomId}`);
        } else {
          logEvent("Failed to join room", response.error, LogLevel.ERROR);
          alert("Failed to join room: " + response.error); // optional: user feedback
        }
      }
    );
    navigate(`/rooms/${RoomId}`);
  };

  const handleJoin = () => {
    const RoomId = placeholderRoomId;
    const uuid = generateUuid();
    const roomData = {
      name: placeholderName,
      userId: uuid,
      roomId: RoomId,
      host: true,
      presenter: false,
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
    navigate(`/rooms/${RoomId}`);
  };
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
