"use client";
import type React from "react";
import { useEffect } from "react";

export interface Point {
  x: number;
  y: number;
}

// credit: https://gist.github.com/balazsbotond/1a876d8ccec87e961ec4a4ae5efb5d33

export class Transform {
  private ctx: CanvasRenderingContext2D;
  private s: number;
  private dx: number;
  private dy: number;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.s = 1;
    this.dx = 0;
    this.dy = 0;
  }

  scale(s: number): void {
    this.ctx.scale(s, s);
    this.s *= 1 / s;
    this.dx *= 1 / s;
    this.dy *= 1 / s;
  }

  translate(dx: number, dy: number): void {
    this.ctx.translate(dx, dy);
    this.dx -= dx;
    this.dy -= dy;
  }

  transform({ x, y }: Point): Point {
    return {
      x: this.s * x + this.dx,
      y: this.s * y + this.dy,
    };
  }
}

export function usePanAndZoom(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- doesn't matter
  drawCanvas: (...args: any[]) => void,
  setDragging: (dragging: boolean) => void,
): void {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");
    const transform = new Transform(ctx);
    let dragging = false;
    let dragStart: Point | null = null;

    const mouseOffset = (e: MouseEvent): Point => {
      return {
        x: e.pageX - canvas.offsetLeft,
        y: e.pageY - canvas.offsetTop,
      };
    };

    const onMouseDown = (e: MouseEvent): void => {
      e.preventDefault();
      e.stopPropagation();
      dragStart = transform.transform(mouseOffset(e));
      dragging = true;
      setDragging(true);
    };

    const onMouseMove = (e: MouseEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      if (!dragging || !dragStart) return;

      const offset = mouseOffset(e);
      const dragEnd = transform.transform(offset);
      const dx = dragEnd.x - dragStart.x;
      const dy = dragEnd.y - dragStart.y;
      transform.translate(dx, dy);
      drawCanvas();
      dragStart = transform.transform(offset);
    };

    const onMouseUp = (e: MouseEvent): void => {
      e.preventDefault();
      e.stopPropagation();
      dragging = false;
      setDragging(false);
    };

    const onWheel = (e: WheelEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      const offset = mouseOffset(e);
      const t = transform.transform(offset);
      transform.translate(t.x, t.y);
      const factor = Math.sign(e.deltaY) > 0 ? 0.98 : 1.02;
      transform.scale(factor);
      transform.translate(-t.x, -t.y);
      drawCanvas();
    };

    canvas.addEventListener("wheel", onWheel);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);

    drawCanvas();

    return () => {
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
    };
  }, [canvasRef, drawCanvas, setDragging]);
}
