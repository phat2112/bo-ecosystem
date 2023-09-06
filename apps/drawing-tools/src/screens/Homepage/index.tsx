import {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
  useRef,
} from "react";
import { useEffect } from "react";

import DrawingPanel, { DrawingAction } from "Components/DrawingPanel";
import Navbar from "Components/Navbar";
import Toolbar from "Components/ToolBar";

import "./index.scss";

interface DrawingAttributes {
  colorPicker: string;
  strokeWidth: number;
  setColorPicker: Dispatch<SetStateAction<string>>;
  setStrokeWidth: Dispatch<SetStateAction<number>>;
}

export const DrawingContext = createContext<DrawingAttributes>(undefined!);

const Homepage = () => {
  const drawingRef = useRef<DrawingAction>(null);
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [colorPicker, setColorPicker] = useState("#000000");

  const onKeyDown = () => {
    const keyDown: string[] = [];

    return (event: KeyboardEvent) => {
      if (event.key === "Control") {
        keyDown.push(event.key);
      }

      if (event.key === "z" && keyDown[keyDown.length - 1] === "Control") {
        keyDown.splice(0, keyDown.length);
        drawingRef?.current?.undo();
      }
    };
  };

  useEffect(() => {
    const handleKeyDown = onKeyDown();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClear = () => {
    drawingRef?.current?.clear();
  };

  const handleUndo = () => {
    drawingRef?.current?.undo();
  };
  return (
    <>
      <Navbar />
      <DrawingContext.Provider
        value={{
          colorPicker,
          strokeWidth,
          setColorPicker,
          setStrokeWidth,
        }}
      >
        <div className="paint-wrapper">
          {/* drawing paint */}
          <DrawingPanel ref={drawingRef} />
          {/* tool bar */}
          <Toolbar
            classNames="paint-wrapper__toolbar"
            handleClear={handleClear}
            handleUndo={handleUndo}
          />
        </div>
      </DrawingContext.Provider>
    </>
  );
};

export default Homepage;
