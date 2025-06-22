"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { usePanAndZoom } from "./canvas";
import { MAP_POINTS } from "./calculate-points";
import { drawBezierCurve } from "./draw-canvas";

export default function CanvasComponent() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [containerRatio, setContainerRatio] = useState(1920 / 1080);
  const [ready, setReady] = useState(false);

  const drawGraph = useCallback(
    (crop = 1) => {
      if (!ready && crop === 1) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);

      MAP_POINTS.forEach((item) => {
        drawBezierCurve({
          ...item,
          ctx: context,
        });
      });

      context.clearRect(canvas.width * crop, 0, canvas.width, canvas.height);
    },
    [ready],
  );

  usePanAndZoom(canvasRef, drawGraph, setDragging);

  useEffect(() => {
    const updateContainerRatio = (): void => {
      const container = containerRef.current;
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      setContainerRatio(width / height);
      setTimeout(drawGraph, 50);
    };

    updateContainerRatio();
    window.addEventListener("resize", updateContainerRatio);
    return () => {
      window.removeEventListener("resize", updateContainerRatio);
    };
  }, [drawGraph]);

  useEffect(() => {
    if (ready) return;
    const animateLoading = (progress = 0): void => {
      if (progress >= 1) return;
      const cubicProgress = Math.pow(progress, 3);
      drawGraph(cubicProgress);
      requestAnimationFrame(() => {
        animateLoading(progress + 0.005);
      });
    };
    animateLoading();
    setReady(true);
  }, [drawGraph, ready]);

  useEffect(() => {
    const font = new FontFace(
      "Roboto Condensed",
      "url(https://fonts.gstatic.com/s/robotocondensed/v27/ieVl2ZhZI2eCN5jzbjEETS9weq8-19K7DQk6YvM.woff2)",
    );
    font.load().then(() => {
      document.fonts.add(font);
    });
  }, []);

  return (
    <div
      className="relative grid h-screen w-screen place-items-center bg-black text-white"
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    >
      <div className="absolute left-0 top-0 grid h-full place-items-center p-20 opacity-20">
        <Image alt="USA map" height={1080} src="/usa.webp" width={1920} />
      </div>
      <div
        className="absolute left-0 top-0 z-0 h-full w-full"
        ref={containerRef}
      >
        <div className="grid h-screen w-screen place-items-center">
          <div className="grid place-items-center border-[0.5px] border-white border-opacity-50">
            <canvas
              className="h-full w-full"
              draggable
              height={1080}
              id="usa"
              ref={canvasRef}
              width={1080 * containerRatio}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
