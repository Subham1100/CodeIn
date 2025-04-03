import React, {
  useRef,
  useEffect,
  RefObject,
  useState,
  useLayoutEffect,
} from "react";
import "./css/canvas.css";
import rough from "roughjs";
import { useSocket } from "../hooks/socketContext.tsx";

interface DrawElement {
  type: string;
  offsetX: number;
  offsetY: number;
  path: [number, number][]; // Array of [x, y] points
  stroke: string;
  width: number;
  height: number;
}

interface CanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  ctxRef: React.RefObject<CanvasRenderingContext2D | null>;
  getElements: DrawElement[];
  setElements: React.Dispatch<React.SetStateAction<DrawElement[]>>;
  tool: string;
  color: string;
}

const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  ctxRef,
  getElements,
  setElements,
  tool,
  color,
}) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight * 2;
    canvas.width = window.innerWidth * 2;
    if (!canvas) {
      console.error("Canvas not found");
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context");
      return;
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
    }
  }, [color]);

  const [isDrawing, setIsDrawing] = useState(false);

  const roughGen = rough.generator();

  useLayoutEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current);
    if (getElements.length > 0) {
      ctxRef.current?.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
    getElements.forEach((ele) => {
      if (ele.type === "pencil") {
        roughCanvas.linearPath(ele.path);
      } else if (ele.type === "line") {
        roughCanvas.draw(
          roughGen.line(ele.offsetX, ele.offsetY, ele.width, ele.height, {
            stroke: ele.stroke,
            strokeWidth: 5,
            roughness: 0,
          })
        );
      } else if (ele.type === "rectangle") {
        roughCanvas.draw(
          roughGen.rectangle(ele.offsetX, ele.offsetY, ele.width, ele.height, {
            stroke: ele.stroke,
            strokeWidth: 5,
            roughness: 0,
          })
        );
      } else if (ele.type === "circle") {
        roughCanvas.draw(
          roughGen.circle(ele.offsetX, ele.offsetY, ele.width, {
            stroke: ele.stroke,
            strokeWidth: 5,
            roughness: 0,
          })
        );
      }
    });
  }, [getElements]);

  const socket = useSocket();

  useEffect(() => {
    const handleUpdateCanvas = (updatedData: {
      type: string;
      element: DrawElement;
    }) => {
      if (updatedData.type === "updateCanvas") {
        setElements((prevElements) => [...prevElements, updatedData.element]);
      }
    };

    socket.on("updateCanvas", handleUpdateCanvas);

    return () => {
      socket.off("updateCanvas", handleUpdateCanvas);
    };
  }, [socket]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (tool === "pencil") {
      setElements((prevElements: DrawElement[]) => [
        ...prevElements, // Spread previous elements correctly
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
          tool: "pencil",
          width: 0,
          height: 0,
        },
      ]);
    } else if (tool === "line") {
      setElements((prevElements: DrawElement[]) => [
        ...prevElements, // Spread previous elements correctly
        {
          type: "line",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          width: offsetX,
          height: offsetY,
          stroke: color,
          tool: "line",
        },
      ]);
    } else if (tool === "rectangle") {
      setElements((prevElements: DrawElement[]) => [
        ...prevElements, // Spread previous elements correctly
        {
          type: "rectangle",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          width: 0,
          height: 0,
          stroke: color,
          tool: "rectangle",
        },
      ]);
    } else if (tool === "circle") {
      setElements((prevElements: DrawElement[]) => [
        ...prevElements, // Spread previous elements correctly
        {
          type: "circle",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          width: 0,
          height: 0,
          stroke: color,
          tool: "circle",
        },
      ]);
    }

    // console.log(offsetX, offsetY);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // console.log("Mouse moving at:", e);
    // const { offsetX, offsetY } = e.nativeEvent;
    // console.log(offsetX, offsetY);
    const { offsetX, offsetY } = e.nativeEvent;
    const {
      path,
      offsetX: startX,
      offsetY: startY,
    } = getElements[getElements.length - 1];
    let width = offsetX - startX;
    let height = offsetY - startY;

    if (isDrawing) {
      // Create the updated path array

      //pencil by default
      const { path } = getElements[getElements.length - 1];
      const newPath: [number, number][] = [...path, [offsetX, offsetY]];
      if (tool === "pencil") {
        setElements((prevElements: DrawElement[]) =>
          prevElements.map((ele, index) => {
            if (index === getElements.length - 1) {
              return {
                ...ele,
                path: newPath,
              };
            } else {
              return ele;
            }
          })
        );
        console.log("element created" + getElements.length);
      } else if (tool === "line") {
        setElements((prevElements: DrawElement[]) =>
          prevElements.map((ele, index) => {
            if (index === getElements.length - 1) {
              return {
                ...ele,
                height: offsetY,
                width: offsetX,
              };
            } else {
              return ele;
            }
          })
        );
      } else if (tool === "rectangle") {
        setElements((prevElements: DrawElement[]) =>
          prevElements.map((ele, index) => {
            if (index === getElements.length - 1) {
              return {
                ...ele,
                width: width,
                height: height,
              };
            } else {
              return ele;
            }
          })
        );
      } else if (tool === "circle") {
        setElements((prevElements: DrawElement[]) =>
          prevElements.map((ele, index) => {
            if (index === getElements.length - 1) {
              return {
                ...ele,
                height: height,
                width: width,
              };
            } else {
              return ele;
            }
          })
        );
      }
      // console.log(newPath);
      // console.log(offsetX, offsetY);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    // const { offsetX, offsetY } = e.nativeEvent;
    // console.log(offsetX, offsetY);
    // console.log("Mouse released", e);
    if (getElements.length === 0) return;
    const newGetElements = getElements[getElements.length - 1];
    socket.emit("drawElement", newGetElements);
    setIsDrawing(false);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="w-[500px] h-[500px] bg-white border-2 border-black cursor-crosshair overflow-hidden"
    >
      {/* {JSON.stringify(getElements)} */}
      <canvas ref={canvasRef} id="paintCanvas"></canvas>
    </div>
  );
};

export default Canvas;
