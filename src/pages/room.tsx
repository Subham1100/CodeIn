import React, { useState, useEffect } from "react";

import Feature from "../components/feature";

const room = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when the component loads
  }, []);
  const [placeholderName, setplaceholderName] = useState("Enter Name");
  const [placeholderRoomCode, setplaceholderRoomCode] = useState("Room Code");
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
              onFocus={() => {
                setplaceholderName("");
              }}
              onBlur={() => setplaceholderName("Enter name")}
            />
            <input
              id="room_code"
              placeholder={placeholderRoomCode}
              className="bg-white rounded-2xl p-2 focus:outline-none"
              onFocus={() => {
                setplaceholderRoomCode("");
              }}
              onBlur={() => setplaceholderRoomCode("Room Code")}
            />
            <button className="bg-black text-white rounded-xl p-2">Join</button>
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
              onFocus={() => {
                setplaceholderName("");
              }}
              onBlur={() => setplaceholderName("Enter name")}
            />
            <button className="bg-black text-white rounded-xl p-2">
              Create
            </button>
          </div>
        }
      />
    </div>
  );
};

export default room;
