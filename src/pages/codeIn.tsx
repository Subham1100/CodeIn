import React, { useEffect, useState } from "react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Cross1Icon,
  Cross2Icon,
  CrossCircledIcon,
  Crosshair2Icon,
  DragHandleDots2Icon,
} from "@radix-ui/react-icons";
import CodeSection from "./CodeSection";

import Sidebar from "../components/sidebar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSocket } from "../hooks/socketContext.tsx";

import TempWhiteboard from "./tempWhiteboard.tsx";
import {
  ArrowBigDownDashIcon,
  ArrowBigLeftDashIcon,
  AxeIcon,
  DoorClosedIcon,
  ForkKnifeCrossed,
} from "lucide-react";

const CodeIn = () => {
  const [members, setMembers] = useState<string[]>([]);
  const [inRoom, setInRoom] = useState(true);
  const { roomId } = useParams();
  const [host, setHost] = useState("");
  const [currUser, setCurrUser] = useState("");
  const [showSideBar, setshowSideBar] = useState(true);
  const [showCodeSection, setShowCodeSection] = useState(true);

  const getMembers = async () => {
    const token = localStorage.getItem("token");
    const authenticationHeader = {
      Authorization: token,
    };

    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/database/api/room/members?roomId=${roomId}`,
      {
        headers: authenticationHeader,
      }
    );
    return response.data;
  };
  const socket = useSocket();
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers();
        setInRoom(true);
        setMembers(data.members);
        setHost(data.host);
        setCurrUser(data.currUser);
      } catch (error) {
        setInRoom(false);
        console.error("Failed to fetch members", error);
      }
    };
    fetchMembers();
    socket.on("members-updated", fetchMembers);
  }, []);

  useEffect(() => {}, [currUser, host, members]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setshowSideBar(false);
      }
    };

    // Run once on mount
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!inRoom) {
    return <div style={{ backgroundColor: "white", height: "100vh" }}></div>;
  }
  const handleResize = (size: number) => {
    if (size <= 2) {
      setShowCodeSection(false);
    } else {
      setShowCodeSection(true);
    }
  };

  return (
    <div className="h-screen flex flex-row">
      <PanelGroup
        autoSaveId="example"
        direction="horizontal"
        className="rounded-lg border "
      >
        <Panel
          defaultSize={27}
          minSize={0}
          collapsedSize={10}
          collapsible
          onResize={handleResize}
          className={`h-full overflow-auto transition-all duration-300 ${
            showCodeSection ? "" : "pointer-events-none"
          }`}
        >
          <CodeSection />
        </Panel>

        <PanelResizeHandle className="flex w-[12px] items-center justify-center bg-black cursor-col-resize transition-all duration-200">
          <div className="z-10 flex h-6 w-6 items-center justify-center rounded-sm border bg-zinc-200 relative">
            <DragHandleDots2Icon className="h-4 w-20 text-gray-700" />
          </div>
        </PanelResizeHandle>

        <Panel className="h-full ">
          {/* <Whiteboard /> */}

          <TempWhiteboard />
        </Panel>
      </PanelGroup>
      {currUser !== "" &&
        currUser !== null &&
        currUser !== undefined &&
        showSideBar === true && (
          <div className="bg-gray-900 text-amber-50">
            <Cross1Icon
              className="w-10 h-7 text-white p-1 rounded-xl cursor-pointer"
              onClick={() => {
                setshowSideBar(!showSideBar);
              }}
            />
            <Sidebar
              hostName={host}
              members={members}
              isHost={currUser === host}
              host={host}
            />
          </div>
        )}
      {showSideBar === false && (
        <div className="absolute right-0 p-0 top-3/6 bg-amber-600 rounded-2xl">
          <button
            className="bg-red-500 h-10 w-30 rounded-2xl"
            onClick={() => {
              setshowSideBar(!showSideBar);
            }}
          >
            Room Info
          </button>
        </div>
      )}
      {showCodeSection === false && (
        <div className="flex absolute left-2/5 p-0 top-1/12 ">
          <p className="bg-red-500 p-1">Slide from left to open Code editor</p>
          <CrossCircledIcon
            onClick={() => {
              setShowCodeSection(!showCodeSection);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CodeIn;
