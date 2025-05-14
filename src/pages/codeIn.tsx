import React, { useEffect, useState } from "react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import CodeSection from "./CodeSection";
import Whiteboard from "./whiteboard";
import Sidebar from "../components/sidebar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSocket } from "../hooks/socketContext.tsx";
import { Socket } from "socket.io-client";

const CodeIn = () => {
  const [members, setMembers] = useState<string[]>([]);
  const [inRoom, setInRoom] = useState(true);
  const { roomId } = useParams();
  const [host, setHost] = useState("");
  const [currUser, setCurrUser] = useState("");

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

  useEffect(() => {}, [currUser, host]);

  if (!inRoom) {
    return <div style={{ backgroundColor: "white", height: "100vh" }}></div>;
  }

  return (
    <div className="h-screen flex flex-row">
      <PanelGroup
        autoSaveId="example"
        direction="horizontal"
        className="rounded-lg border "
      >
        <Panel defaultSize={25} minSize={25} className="h-full overflow-auto">
          <CodeSection />
        </Panel>

        <PanelResizeHandle className="flex w-[4px] items-center justify-center bg-black">
          <div className="z-10 flex h-6 w-4 items-center justify-center rounded-sm border bg-zinc-200">
            <DragHandleDots2Icon className="h-4 w-4" />
          </div>
        </PanelResizeHandle>

        <Panel defaultSize={25} className="h-full overflow-auto">
          <Whiteboard />
        </Panel>
      </PanelGroup>
      {(currUser !== "" || currUser !== null || currUser !== undefined) && (
        <Sidebar
          hostName={host}
          members={members}
          isHost={currUser === host}
          host={host}
        />
      )}
    </div>
  );
};

export default CodeIn;
