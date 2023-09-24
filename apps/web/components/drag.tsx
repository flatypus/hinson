import { useEffect, useRef, useState } from "react";

export default function Drag(): JSX.Element {
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startedDrag, setStartedDrag] = useState(false);
  const canvasReference = useRef<HTMLCanvasElement>(null);
  const [windowSize, setWindowSize] = useState([0, 0]);

  useEffect(() => {
    const handleResize = (): void => {
      setWindowSize([window.innerWidth, window.innerHeight - 64]);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      className="absolute left-0 top-0"
      height={windowSize[1]}
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
        width: windowSize[0],
        height: windowSize[1],
        cursor: startedDrag ? "crosshair" : "default",
      }}
      width={windowSize[0]}
    />
  );
}
