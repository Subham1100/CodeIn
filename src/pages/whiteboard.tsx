import React, { useState, useRef, useEffect, MouseEventHandler } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../hooks/socketContext";
import { logEvent, LogLevel } from "../utils/logger";
import Canvas from "./canvas";
import axios from "axios";

interface DrawElement {
  type: string;
  offsetX: number;
  offsetY: number;
  path: [number, number][];
  stroke: string;
  width: number;
  height: number;
}
type AccessOptions = {
  whiteboard: boolean;
  codeEditor: boolean;
};

const Whiteboard = () => {
  const [getTool, setTool] = useState<string>("pencil");
  const [getColor, setColor] = useState<string>("black");
  const [getHistory, setHistory] = useState<DrawElement[]>([]);
  const [getElements, setElements] = useState<DrawElement[]>([]);
  const [accessData, setAccessData] = useState<AccessOptions>({
    whiteboard: false,
    codeEditor: false,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null!);

  const { roomId } = useParams();
  const socket = useSocket();

  useEffect(() => {
    if (!roomId || !socket.connected) {
      logEvent(
        "RoomOrSocketNotReady",
        { roomId, socketConnected: socket.connected },
        LogLevel.WARN
      );
      return;
    }

    socket.on("userIsJoined", (data) => {
      if (data.success) {
        logEvent("UserJoinedRoom", { roomId, user: data.user }, LogLevel.INFO);
      } else {
        logEvent(
          "UserJoinError",
          { roomId, user: data.user, error: data.error || "No error provided" },
          LogLevel.ERROR
        );
      }
    });

    return () => {
      socket.off("userIsJoined");
    };
  }, [roomId, socket]);

  useEffect(() => {
    const handleUpdateCanvas = (updatedData: {
      type: string;
      element: DrawElement;
    }) => {
      logEvent(
        "HandleUpdateCanvas Called",
        { type: updatedData.type },
        LogLevel.DEBUG
      );

      if (updatedData.type === "updateCanvas") {
        setElements((prev) => [...prev, updatedData.element]);
        logEvent(
          "CanvasUpdated",
          { element: updatedData.element },
          LogLevel.INFO
        );
      } else {
        logEvent(
          "UnexpectedUpdateType",
          { type: updatedData.type },
          LogLevel.WARN
        );
      }
    };

    const handleUpdateUndoCanvas = (updatedData: {
      type: string;
      element: DrawElement;
    }) => {
      logEvent(
        "HandleUpdateUndoCanvas Called",
        { type: updatedData.type },
        LogLevel.DEBUG
      );

      if (updatedData.type === "undoCanvas") {
        if (getElements.length === 1) {
          setHistory((prev) => [...prev, getElements[0]]);
          handleClear();
        } else {
          setHistory((prev) => [...prev, getElements[getElements.length - 1]]);
          setElements((prev) => prev.slice(0, prev.length - 1));
        }

        logEvent("CanvasUndo", { element: updatedData.element }, LogLevel.INFO);
      }
    };

    const handleUpdateClearCanvas = (updatedData: { type: string }) => {
      logEvent(
        "HandleUpdateClearCanvas Called",
        { type: updatedData.type },
        LogLevel.DEBUG
      );

      if (updatedData.type === "clearCanvas") {
        if (getElements.length > 0) {
          setHistory((prev) => [...prev, getElements[getElements.length - 1]]);
        }

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx) {
          logEvent(
            "CanvasContextError",
            { message: "2D context not available" },
            LogLevel.ERROR
          );
          return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setElements([]);
        logEvent("CanvasCleared", {}, LogLevel.INFO);
      }
    };

    socket.on("updateCanvas", handleUpdateCanvas);
    socket.on("updateUndoCanvas", handleUpdateUndoCanvas);
    socket.on("updateClearCanvas", handleUpdateClearCanvas);

    return () => {
      socket.off("updateCanvas", handleUpdateCanvas);
      socket.off("updateUndoCanvas", handleUpdateUndoCanvas);
      socket.off("updateClearCanvas", handleUpdateClearCanvas);
    };
  }, [socket, getElements]);

  const handleClear = () => {
    logEvent(
      "HandleClear Triggered",
      { elementsCount: getElements.length },
      LogLevel.DEBUG
    );
    try {
      if (getElements.length > 0) {
        setHistory((prev) => [...prev, getElements[getElements.length - 1]]);
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        logEvent(
          "CanvasContextError",
          { message: "Canvas context unavailable during clear" },
          LogLevel.ERROR
        );
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setElements([]);
      socket.emit("clearCanvas");

      logEvent("CanvasClearedAndEmitted", {}, LogLevel.INFO);
    } catch (err: any) {
      logEvent(
        "HandleClearError",
        { error: err.message || String(err) },
        LogLevel.ERROR
      );
    }
  };

  const handleUndo: MouseEventHandler<HTMLButtonElement> = () => {
    if (getElements.length === 0) {
      logEvent("UndoBlocked", { reason: "No elements to undo" }, LogLevel.WARN);
      return;
    }

    try {
      if (getElements.length === 1) {
        setHistory((prev) => [...prev, getElements[0]]);
        handleClear();
      } else {
        setHistory((prev) => [...prev, getElements[getElements.length - 1]]);
        setElements((prev) => prev.slice(0, prev.length - 1));
      }

      const lastDrawn = getHistory[getHistory.length - 1];
      socket.emit("undoCanvas", lastDrawn);
      logEvent("UndoPerformed", { lastDrawn }, LogLevel.INFO);
    } catch (err: any) {
      logEvent(
        "UndoError",
        { error: err.message || String(err) },
        LogLevel.ERROR
      );
    }
  };

  const handleRedo = () => {
    if (getHistory.length === 0) {
      logEvent("RedoBlocked", { reason: "History empty" }, LogLevel.WARN);
      return;
    }

    try {
      const lastElement = getHistory[getHistory.length - 1];
      if (!lastElement) {
        logEvent(
          "RedoError",
          { message: "Last history element not found" },
          LogLevel.ERROR
        );
        return;
      }

      setElements((prev) => [...prev, lastElement]);
      setHistory((prev) => prev.slice(0, prev.length - 1));
      socket.emit("drawElement", lastElement);

      logEvent("RedoPerformed", { lastElement }, LogLevel.INFO);
    } catch (err: any) {
      logEvent(
        "RedoException",
        { error: err.message || String(err) },
        LogLevel.ERROR
      );
    }
  };

  useEffect(() => {
    const updateOptions = async () => {
      const token = localStorage.getItem("token");
      const authenticationHeader = {
        Authorization: token,
      };
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/database/api/room/get-permission`,
          {
            params: {
              roomId: roomId,
            },
            headers: authenticationHeader,
          }
        );
        setAccessData(response.data.permissions);
      } catch (error) {
        console.log(error);
      }
    };
    updateOptions();

    socket.on("access-updated", updateOptions);
  }, []);

  useEffect(() => {
    if (accessData.whiteboard === false) {
      setTool("");
    } else {
      setTool("pencil");
    }
  }, [accessData]);

  useEffect(() => {
    const sendWhiteboardElements = async () => {
      const token = localStorage.getItem("token");
      const authenticationHeader = {
        Authorization: token,
      };

      try {
        const response = await axios.put(
          `${
            import.meta.env.VITE_API_URL
          }/database/api/room/whiteboardElements`,
          { roomId: roomId, whiteboardElements: getElements },
          {
            headers: authenticationHeader,
          }
        );
        return response.data;
      } catch (error) {}
    };
    if (getElements.length > 0) sendWhiteboardElements();
  }, [getElements]);

  useEffect(() => {
    const sendWhiteboardHistory = async () => {
      const token = localStorage.getItem("token");
      const authenticationHeader = {
        Authorization: token,
      };
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/database/api/room/whiteboardHistory`,
          { roomId: roomId, whiteboardHistory: getHistory },
          {
            headers: authenticationHeader,
          }
        );
        return response.data;
      } catch (error) {}
    };
    if (getHistory.length > 0) sendWhiteboardHistory();
  }, [getHistory]);

  useEffect(() => {
    const getWhiteboardHistory = async () => {
      const token = localStorage.getItem("token");
      const authenticationHeader = {
        Authorization: token,
      };
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/database/api/room/whiteboardHistory`,
          {
            headers: authenticationHeader,
            params: {
              roomId: roomId,
            },
          }
        );
        setHistory(response.data.whiteboardHistory);
      } catch (error) {}
    };
    const getWhiteboardElements = async () => {
      const token = localStorage.getItem("token");
      const authenticationHeader = {
        Authorization: token,
      };
      try {
        const response = await axios.get(
          `${process.env.VITE_API_URL}/database/api/room/whiteboardElements`,
          {
            headers: authenticationHeader,
            params: {
              roomId: roomId,
            },
          }
        );
        setElements(response.data.whiteboardElements);
      } catch (error) {}
    };

    getWhiteboardHistory();
    getWhiteboardElements();
  }, []);

  return (
    <div className="overflow-scroll h-full">
      <div>Whiteboard</div>
      <div>Users Online</div>
      <div id="tools_container">
        <h1 id="tools_title">Tools</h1>
        <div id="toolbar">
          <label htmlFor="pencil">Pencil</label>
          <input
            type="radio"
            id="pencil"
            name="tool"
            value="pencil"
            defaultChecked
            onChange={(e) => setTool(e.target.value)}
            disabled={accessData?.whiteboard === false}
          />

          <label htmlFor="line">line</label>
          <input
            type="radio"
            id="line"
            name="tool"
            value="line"
            checked={getTool === "line"}
            onChange={(e) => setTool(e.target.value)}
            disabled={accessData?.whiteboard === false}
          />

          <label htmlFor="array">Array</label>
          <input
            type="radio"
            id="array"
            name="tool"
            value="array"
            checked={getTool === "array"}
            onChange={(e) => setTool(e.target.value)}
            disabled={accessData?.whiteboard === false}
          />

          <label htmlFor="graph">Graph</label>
          <input
            type="radio"
            id="graph"
            name="tool"
            value="graph"
            checked={getTool === "graph"}
            onChange={(e) => setTool(e.target.value)}
            disabled={accessData?.whiteboard === false}
          />

          <label htmlFor="rectangle">Rectangle</label>
          <input
            type="radio"
            id="rectangle"
            name="tool"
            value="rectangle"
            checked={getTool === "rectangle"}
            onChange={(e) => setTool(e.target.value)}
            disabled={accessData?.whiteboard === false}
          />
          <label htmlFor="circle">circle</label>
          <input
            type="radio"
            id="circle"
            name="tool"
            value="circle"
            checked={getTool === "circle"}
            onChange={(e) => setTool(e.target.value)}
            disabled={accessData?.whiteboard === false}
          />

          <p>Selected Tool: {getTool}</p>
        </div>
        <div id="select_color">
          <label htmlFor="select_color">selec color</label>
          <input
            type="color"
            id="color"
            value={getColor}
            onChange={(e) => {
              setColor(e.target.value);
            }}
          />
        </div>
        <div id="actions">
          <button
            id="undo_button"
            className={`p-2 border-2 border-black text-white ${
              getElements.length === 0
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500"
            }`}
            disabled={getElements.length === 0}
            onClick={handleUndo}
          >
            Undo
          </button>
          <button
            id="redo_button"
            className={`p-2 border-2 border-black text-white ${
              getHistory.length === 0
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500"
            }`}
            disabled={getHistory.length === 0}
            onClick={handleRedo}
          >
            Redo
          </button>
          <button id="clear_canvas" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>
      <div id="canvas_container" className="h-[300px] w-[300px]">
        <Canvas
          canvasRef={canvasRef}
          ctxRef={ctxRef}
          getElements={getElements}
          setElements={setElements}
          tool={getTool}
          color={getColor}
        />
      </div>
    </div>
  );
};

export default Whiteboard;
