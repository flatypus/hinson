export interface Point {
  name: string;
  cost: number;
  subcategories?: Point[];
}

export interface BezierCurveCoordinates {
  x: [number, number, number, number];
  y: [number, number, number, number];
}

export interface DrawBezierCurveOptions {
  ctx: CanvasRenderingContext2D;
  points: BezierCurveCoordinates;
  text?: {
    title: string;
    subtitle: string;
  };
  textScale?: number;
  thickness?: number;
  colorLeft?: string;
  colorRight?: string;
  opacity?: number;
  leaf?: boolean;
}

export type MapPoint = Omit<DrawBezierCurveOptions, "ctx" | "scale">;
