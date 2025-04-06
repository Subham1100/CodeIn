import React from "react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import CodeSection from "./CodeSection";

const CodeIn = () => {
  return (
    <div className="h-screen">
      <PanelGroup
        autoSaveId="example"
        direction="horizontal"
        className="rounded-lg border "
      >
        <Panel defaultSize={25} minSize={25}>
          <CodeSection />
        </Panel>

        <PanelResizeHandle className="flex w-[4px] items-center justify-center bg-black">
          <div className="z-10 flex h-6 w-4 items-center justify-center rounded-sm border bg-zinc-200">
            <DragHandleDots2Icon className="h-4 w-4" />
          </div>
        </PanelResizeHandle>

        <Panel defaultSize={25}>{/* <Whiteboard /> */}</Panel>
      </PanelGroup>
    </div>
  );
};

export default CodeIn;
