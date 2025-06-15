import { useEffect, useState } from "react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Cross1Icon,
  CrossCircledIcon,
  DragHandleDots2Icon,
} from "@radix-ui/react-icons";
import CodeSection from "./CodeSection";
import Sidebar from "../components/sidebar";
import TempWhiteboard from "./tempWhiteboard.tsx";
const CodeIn = () => {
  const [showSideBar, setshowSideBar] = useState(true);
  const [showCodeSection, setShowCodeSection] = useState(true);
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setshowSideBar(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResizeCodeSection = (size: number) => {
    if (size <= 2) {
      setShowCodeSection(false);
    } else {
      setShowCodeSection(true);
    }
  };
  const handleResizeWhiteboard = (size: number) => {
    if (size <= 2) {
      setShowWhiteboard(false);
    } else {
      setShowWhiteboard(true);
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
          onResize={handleResizeCodeSection}
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

        <Panel
          minSize={0}
          collapsedSize={10}
          collapsible
          onResize={handleResizeWhiteboard}
          className={` overflow-auto transition-all duration-300 ${
            showCodeSection ? "" : "pointer-events-none"
          }`}
        >
          {/* <Whiteboard /> */}

          <TempWhiteboard />
        </Panel>
      </PanelGroup>
      {showSideBar === true && (
        <div className="bg-gray-900 text-amber-50">
          <Cross1Icon
            className="w-10 h-7 text-white p-1 rounded-xl cursor-pointer"
            onClick={() => {
              setshowSideBar(!showSideBar);
            }}
          />
          <Sidebar />
        </div>
      )}
      {showSideBar === false && (
        <div className="absolute right-0 p-0 top-3/6 bg-amber-600 rounded-2xl">
          <button
            className="bg-[#624c99] h-10 w-30 rounded-2xl"
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
          <p className="bg-yellow-200 p-2 rounded-xl">
            Slide from left to open Code editor
          </p>
          <CrossCircledIcon
            className="bg-white"
            onClick={() => {
              setShowCodeSection(!showCodeSection);
            }}
          />
        </div>
      )}
      {showWhiteboard === false && (
        <div className="flex absolute left-2/5 p-0 top-1/12 ">
          <p className="bg-yellow-200 p-2 rounded-xl">
            Slide from right to open Whiteboard
          </p>
          <CrossCircledIcon
            className="bg-white"
            onClick={() => {
              setShowWhiteboard(!showWhiteboard);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CodeIn;
