import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import { DrawingContext } from "Screen/Homepage";

import "./index.scss";

interface Position {
  x: number;
  y: number;
}

type PositionTuple = [number, number];

interface LineProps {
  points: PositionTuple[];
  color?: string;
  strokeWidth?: number;
}

export interface DrawingAction {
  clear: () => void;
  undo: () => void;
}

const onDrawing = (
  newPosition: Position,
  oldPosition: Position,
  { color, strokeWidth }: { color: string; strokeWidth: number },
  ctx: CanvasRenderingContext2D | null
) => {
  if (ctx) {
    ctx.beginPath();
    ctx.moveTo(oldPosition.x, oldPosition.y);
    ctx.lineTo(newPosition.x, newPosition.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.closePath();
  }
};

const onUndo = (
  backupLines: LineProps[],
  ctx: CanvasRenderingContext2D | null,
  { width, height }: { width: number; height: number }
) => {
  if (backupLines?.length && ctx) {
    console.log({ backupLines });
    backupLines.pop();

    ctx.clearRect(0, 0, width, height);

    for (const lines of backupLines) {
      const { points, color, strokeWidth } = lines;
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        const [x, y] = points[i];

        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color || "black";
      ctx.lineWidth = strokeWidth || 1;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.closePath();
    }
  }
};

const DrawingPanel = forwardRef<DrawingAction>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContext = useRef<CanvasRenderingContext2D | null>(null);
  const isMouseDown = useRef(false);
  const mousePosition = useRef<Position>({ x: 0, y: 0 });

  const { strokeWidth, colorPicker } = useContext(DrawingContext);
  const backupLines = useRef<LineProps[]>([]); // [x, y]

  useImperativeHandle(
    ref,
    () => {
      return {
        clear() {
          if (canvasContext.current && canvasRef.current) {
            canvasContext.current.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
          }
        },
        undo() {
          if (canvasRef.current) {
            const { width, height } = canvasRef.current.getBoundingClientRect();
            onUndo(backupLines.current, canvasContext.current, {
              width,
              height,
            });
          }
        },
      };
    },
    []
  );

  const onDraw = useCallback(
    (newPosition: Position, oldPosition: Position) => {
      if (isMouseDown.current) {
        onDrawing(
          newPosition,
          oldPosition,
          { color: colorPicker, strokeWidth },
          canvasContext.current
        );
        backupLines.current[backupLines.current.length - 1].points.push([
          newPosition.x,
          newPosition.y,
        ]);
      }
    },
    [colorPicker, strokeWidth]
  );

  const handleMouseMove = useCallback(
    (ev: MouseEvent) => {
      const newPosition = {
        x: ev.clientX,
        y: ev.clientY - 90,
      };
      onDraw(newPosition, mousePosition.current);

      mousePosition.current = newPosition;
    },
    [onDraw]
  );

  const handleMouseDown = useCallback(
    (ev: MouseEvent) => {
      if (canvasRef?.current?.contains(ev.target as Node)) {
        isMouseDown.current = true;
        backupLines.current.push({
          points: [],
          color: colorPicker,
          strokeWidth,
        });
      }
    },
    [colorPicker, strokeWidth]
  );

  const handleMouseUp = () => {
    isMouseDown.current = false;
  };

  useEffect(() => {
    if (containerRef.current && canvasRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      const ctx = canvasRef.current.getContext("2d");

      canvasContext.current = ctx;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove]);

  return (
    <div className="drawing__container" ref={containerRef}>
      <canvas ref={canvasRef} className="drawing__panel" />
    </div>
  );
});

export default DrawingPanel;
