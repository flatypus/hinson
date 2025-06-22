import { useState } from "react";
import useElementSize from "@lib/hooks/use-element-size";

export default function Drag() {
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startedDrag, setStartedDrag] = useState(false);
  const {
    width,
    height,
    elementReference: canvasReference,
  } = useElementSize<HTMLCanvasElement>();

  return (
    <canvas
      className="absolute left-0 top-0"
      height={height}
      onMouseDown={(e) => {
        setStartPos({ x: e.clientX, y: e.clientY });
        setStartedDrag(true);
      }}
      onMouseMove={(e) => {
        if (startedDrag) {
          const ctx = canvasReference.current?.getContext("2d");
          if (!ctx) return;
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          ctx.beginPath();
          ctx.rect(
            startPos.x,
            startPos.y,
            e.clientX - startPos.x,
            e.clientY - startPos.y,
          );
          ctx.fillStyle = "#73A2Dd66";
          ctx.fill();
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = "#72AcE4FF";
          ctx.stroke();
        }
      }}
      onMouseUp={() => {
        if (startedDrag) {
          const ctx = canvasReference.current?.getContext("2d");
          if (!ctx) return;
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
        setStartedDrag(false);
      }}
      ref={canvasReference}
      style={{
        width,
        height,
        cursor: startedDrag ? "crosshair" : "default",
      }}
      width={width}
    />
  );
}
