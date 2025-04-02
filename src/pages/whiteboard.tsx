import React, { useState, useRef, useEffect, MouseEventHandler } from "react";
import Canvas from "./canvas";

const Whiteboard = () => {
  const [getTool, setTool] = useState<string>("pencil");
  const [getColor, setColor] = useState<string>("black");
  const [getHistory, setHistory] = useState<DrawElement[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null!);
  interface DrawElement {
    type: string;
    offsetX: number;
    offsetY: number;
    path: [number, number][]; // Array of [x, y] points
    stroke: string;
    width: number;
    height: number;
  }
  const [getElements, setElements] = useState<DrawElement[]>([]);
  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setElements([]);
  };

  const handleUndo: MouseEventHandler<HTMLButtonElement> = () => {
    if (getElements.length === 1) {
      setHistory((prev) => [...prev, getElements[getElements.length - 1]]);
      handleClear();
    } else {
      // console.log("before slice" + getElements.length);
      setHistory((prevHistory) => [
        ...prevHistory,
        getElements[getElements.length - 1],
      ]);
      setElements((prevElement) =>
        prevElement.slice(0, prevElement.length - 1)
      );
      // console.log("after slice" + getElements.length);
    }
  };

  const handleRedo = () => {
    setElements((prevElements) => [
      ...prevElements,
      getHistory[getHistory.length - 1],
    ]);
    setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
  };
  return (
    <div>
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
            checked={getTool === "pencil"}
            defaultChecked
            onChange={(e) => setTool(e.target.value)}
          />

          <label htmlFor="line">line</label>
          <input
            type="radio"
            id="line"
            name="tool"
            value="line"
            checked={getTool === "line"}
            onChange={(e) => setTool(e.target.value)}
          />

          <label htmlFor="array">Array</label>
          <input
            type="radio"
            id="array"
            name="tool"
            value="array"
            checked={getTool === "array"}
            onChange={(e) => setTool(e.target.value)}
          />

          <label htmlFor="graph">Graph</label>
          <input
            type="radio"
            id="graph"
            name="tool"
            value="graph"
            checked={getTool === "graph"}
            onChange={(e) => setTool(e.target.value)}
          />

          <label htmlFor="rectangle">Rectangle</label>
          <input
            type="radio"
            id="rectangle"
            name="tool"
            value="rectangle"
            checked={getTool === "rectangle"}
            onChange={(e) => setTool(e.target.value)}
          />
          <label htmlFor="circle">circle</label>
          <input
            type="radio"
            id="circle"
            name="tool"
            value="circle"
            checked={getTool === "circle"}
            onChange={(e) => setTool(e.target.value)}
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
