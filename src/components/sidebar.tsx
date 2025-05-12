import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
interface SidebarProps {
  hostName: string;
  members: string[];
  isHost: boolean;
  host: string;
}
type AccessOptions = {
  whiteboard: boolean;
  codeEditor: boolean;
  codeEditorOptions: boolean;
};
import axios from "axios";
import { useSocket } from "../hooks/socketContext.tsx";
import MemberDropdown from "./memberDropdown.tsx";
import {
  Pencil,
  PencilOff,
  Keyboard,
  KeyboardOff,
  Save,
  SaveOff,
} from "lucide-react";

const Sidebar: React.FC<SidebarProps> = ({
  hostName,
  members,
  isHost,
  host,
}) => {
  const socket = useSocket();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);

  const [accessData, setAccessData] = useState<Record<string, AccessOptions>>(
    {}
  );
  const handleLeaveMember = () => {
    const token = localStorage.getItem("token");
    const roomData = {
      token: token,
      roomId: roomId,
    };
    socket.emit(
      "leave",
      roomData,
      (response: { status: string; error?: string }) => {
        if (response.status === "ok") console.log("left sucessfully");
      }
    );
    navigate("/rooms");
  };

  const handleKickMember = (member: string) => {
    const token = localStorage.getItem("token");
    const authenticationHeader = {
      Authorization: token,
    };
    axios
      .delete("http://localhost:3000/database/api/room/kick", {
        headers: authenticationHeader,
        data: { username: member, roomId: roomId },
      })
      .then((response) => {
        console.log("kicked successfully");
      })
      .catch((error) => {
        console.log(error);
      });
    const roomData = {
      roomId: roomId,
    };
    socket.emit("member-kicked", roomData);
  };

  useEffect(() => {
    const updateOptions = async () => {
      const token = localStorage.getItem("token");
      const authenticationHeader = {
        Authorization: token,
      };
      try {
        const response = await axios.get(
          `http://localhost:3000/database/api/room/get-access`,
          {
            params: {
              roomId: roomId,
            },
            headers: authenticationHeader,
          }
        );
        setAccessData(response.data.accessData);
      } catch (error) {
        console.log(error);
      }
    };
    updateOptions();

    socket.on("access-updated", updateOptions);
  }, []);

  useEffect(() => {}, [accessData]);

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4 flex flex-col space-y-6">
      {/* Host Name */}
      <div className="text-lg font-semibold border-b border-gray-700 pb-2">
        Host: <span className="text-green-400">{hostName}</span>
      </div>

      {/* Room Members */}
      <div className="flex-1">
        <h2 className="text-md font-semibold mb-2">Room Members:</h2>
        <ul className="space-y-1 max-h-48 overflow-y-auto">
          {members.map((member, index) => (
            <li
              key={index}
              className="bg-gray-800 p-2 rounded flex justify-between items-center"
            >
              <span>{member}</span>

              {isHost && member !== host && (
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setToggle(!toggle)}
                    className="bg-[#2b5f23] p-1.5 rounded flex items-center justify-center hover:bg-[#94e58a]"
                  >
                    <MemberDropdown member={member} accessData={accessData} />
                  </button>
                  <button
                    onClick={() => handleKickMember(member)}
                    className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
                  >
                    Kick
                  </button>
                </div>
              )}
              {!isHost && (
                <div className="flex flex-row gap-x-2">
                  {accessData[member]?.whiteboard ? (
                    <Pencil className="w-5 h-5 text-blue-500" />
                  ) : (
                    <PencilOff className="w-5 h-5 text-blue-500" />
                  )}

                  {accessData[member]?.codeEditor ? (
                    <Keyboard className="w-5 h-5 text-blue-500" />
                  ) : (
                    <KeyboardOff className="w-5 h-5 text-blue-500" />
                  )}
                  {accessData[member]?.codeEditorOptions ? (
                    <Save className="w-5 h-5 text-blue-500" />
                  ) : (
                    <SaveOff className="w-5 h-5 text-blue-500" />
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Leave Room Button */}
      <button
        onClick={handleLeaveMember}
        className="bg-red-600 hover:bg-red-700 transition p-2 rounded text-sm font-medium"
      >
        Leave Room
      </button>
    </div>
  );
};

export default Sidebar;
