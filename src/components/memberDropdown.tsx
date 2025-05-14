import { useState, useRef, useEffect } from "react";
import { SquarePen, Target } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSocket } from "../hooks/socketContext.tsx";

type AccessOptions = {
  whiteboard: boolean;
  codeEditor: boolean;
  codeEditorOptions: boolean;
};

type Props = {
  member: string;
  accessData: Record<string, AccessOptions>;
};

const MemberDropdown = ({ member, accessData }: Props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();
  const [options, setOptions] = useState({
    whiteboard: accessData[member].whiteboard,
    codeEditor: accessData[member].codeEditor,
    codeEditorOptions: accessData[member].codeEditorOptions,
  });
  const { roomId } = useParams();

  const toggleOption = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const updateAccess = async () => {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/database/api/room/access`,
          {
            roomId: roomId,
            member,
            newAccess: options,
            username: member,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log("Access updated");
      } catch (error) {
        console.error("Failed to update access", error);
      }
    };
    updateAccess();
    const roomData = {
      roomId: roomId,
    };
    socket.emit("access-changed", roomData);
  }, [options]);

  return (
    <div className="absolute" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="bg-[#aaf19f] p-2 rounded hover:bg-[#94e58a]"
      >
        <SquarePen className="w-4 h-4 text-white" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-40 bg-[#1c3052cf] rounded shadow-lg p-3 z-20">
          <label className="flex items-center gap-2 mb-2 text-sm">
            <input
              type="checkbox"
              checked={options.whiteboard}
              onChange={() => toggleOption("whiteboard")}
            />
            Whiteboard
          </label>
          <label className="flex items-center gap-2 mb-2 text-sm">
            <input
              type="checkbox"
              checked={options.codeEditor}
              onChange={() => toggleOption("codeEditor")}
            />
            Code Editor
          </label>
          <label className="flex items-center gap-2 mb-2 text-sm">
            <input
              type="checkbox"
              checked={options.codeEditorOptions}
              onChange={() => toggleOption("codeEditorOptions")}
            />
            Code Editor Options
          </label>
        </div>
      )}
    </div>
  );
};

export default MemberDropdown;
