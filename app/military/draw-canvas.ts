import type { DrawBezierCurveOptions } from "./types";

const DRAW_CONTROL_POINTS = false;

export const drawBezierCurve = ({
  ctx,
  points,
  text,
  textScale = 1,
  thickness = 1,
  colorLeft = "#ffffff",
  colorRight = "#ffffff",
  opacity = 0.3,
  leaf = false,
}: DrawBezierCurveOptions): void => {
  const scaledPoints = {
    x: points.x.map((point) => point),
    y: points.y.map((point) => point),
  };
  const [x1, x2, x3, x4] = scaledPoints.x;
  const [y1, y2, y3, y4] = scaledPoints.y;

  const gradient = ctx.createLinearGradient(x1, y1, x4, y4);
  gradient.addColorStop(
    0.2,
    `${colorLeft}${Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0")}`,
  );
  gradient.addColorStop(
    0.8,
    `${colorRight}${Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0")}`,
  );

  // Set the stroke style to the gradient
  ctx.strokeStyle = gradient;
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.bezierCurveTo(x2, y2, x3, y3, x4, y4);
  ctx.stroke();

  // draw two thick vertical borders on left and right
  ctx.strokeStyle = colorLeft;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x1, y1 - thickness / 2);
  ctx.lineTo(x1, y1 + thickness / 2);
  ctx.stroke();
  ctx.strokeStyle = colorRight;
  ctx.beginPath();
  ctx.moveTo(x4, y4 - thickness / 2);
  ctx.lineTo(x4, y4 + thickness / 2);
  ctx.stroke();

  if (DRAW_CONTROL_POINTS) {
    for (const [x, y] of [
      [x1, y1],
      [x2, y2],
      [x3, y3],
      [x4, y4],
    ]) {
      ctx.fillStyle = "white";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  }

  if (!text) return;

  const drawText = (
    textContent: string,
    yOffset: number,
    fontSize: number,
    centerX: number,
    centerY: number,
  ): void => {
    ctx.font = `400 ${fontSize}px 'Roboto Condensed', sans-serif`;
    ctx.fillStyle = "white";
    ctx.save();
    ctx.translate(centerX, centerY + yOffset);
    ctx.scale(textScale, textScale);
    const textMetrics = ctx.measureText(textContent);
    const textWidth = textMetrics.width;
    const textHeight = textMetrics.actualBoundingBoxAscent;
    ctx.fillText(textContent, leaf ? 0 : -textWidth / 2, textHeight / 2);
    ctx.restore();
  };

  const yOffset = textScale;
  if (leaf) {
    drawText(`${text.title}: ${text.subtitle}`, yOffset, 16, x4 + 4, y4);
  } else {
    const centerX = (x1 + x2 + x3 + x4) / 4;
    const centerY = (y1 + y2 + y3 + y4) / 4;
    drawText(text.title, -10 * yOffset, 16, centerX, centerY);
    drawText(text.subtitle, 10 * yOffset, 12, centerX, centerY);
  }
};
