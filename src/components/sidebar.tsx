import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type AccessOptions = {
  whiteboard: boolean;
  codeEditor: boolean;
  codeEditorOptions: boolean;
};
import axios from "axios";
import { useSocket } from "../context/socketContext.tsx";
import MemberDropdown from "./memberDropdown.tsx";
import {
  Pencil,
  PencilOff,
  Keyboard,
  KeyboardOff,
  Save,
  SaveOff,
} from "lucide-react";
import { userRoomInfo } from "../hooks/userRoomInfo.tsx";
import { useRoom } from "../context/RoomContext.tsx";
const API_URL = import.meta.env.VITE_API_URL;
import useErrorRedirect from "../hooks/useErrorRedirects.tsx"; // adjust path
import LoadingPage from "./loadingPage.tsx";

const Sidebar = () => {
  const socket = useSocket();
  const { roomId } = useParams();

  const [toggle, setToggle] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [accessData, setAccessData] = useState<Record<string, AccessOptions>>(
    {}
  );
  const info = userRoomInfo(roomId, socket);

  const roomInfo = info?.roomInfo ?? { members: [], host: "", currUser: "" };
  const inRoom = info?.inRoom ?? false;

  useErrorRedirect(
    inRoom,
    "You are not in the room or the room does not exist."
  );
  const { leaveRoom, kickMember } = useRoom();
  if (!inRoom) return <LoadingPage />;

  const handleLeaveMember = () => {
    if (roomId) leaveRoom(roomId);
  };

  const handleKickMember = (username: string) => {
    if (roomId) kickMember(roomId, username);
  };

  useEffect(() => {
    setIsHost(roomInfo.host === roomInfo.currUser);
  }, [roomInfo.currUser, roomInfo.host, roomInfo.members]);

  useEffect(() => {
    const updateOptions = async () => {
      const token = localStorage.getItem("token");
      const authenticationHeader = {
        Authorization: token,
      };
      try {
        const response = await axios.get(
          `${API_URL}/database/api/room/get-access`,
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
        Host: <span className="text-green-400">{roomInfo.host}</span>
      </div>

      {/* Room Members */}
      <div className="flex-1">
        <h2 className="text-md font-semibold mb-2">Room Members:</h2>
        <ul className="space-y-1 max-h-48 overflow-y-auto">
          {roomInfo.members.map((member, index) => (
            <li
              key={index}
              className="bg-gray-800 p-2 rounded flex justify-between items-center"
            >
              <span>{member}</span>

              {isHost && member !== roomInfo.host && (
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
