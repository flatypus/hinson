import data from "./data.json";
import type { Point, MapPoint } from "./types";

const START_X = 50;
const MAX_WIDTH = 1080;

function genColor(seed: number): string {
  let color = Math.floor(Math.abs(Math.sin(seed) * 16777215)).toString(16);
  while (color.length < 6) {
    color = `0${color}`;
  }
  return color;
}

function getPoints(
  point: Point,
  depth = 0,
  y = 500,
  newY = 500,
  childYOffset = 0,
  lastColor = "#3089be",
  points: MapPoint[] = [],
): MapPoint[] {
  const x1 = START_X + (MAX_WIDTH / 3) * depth;
  const x2 = START_X + (MAX_WIDTH / 3) * depth + 180;
  const x3 = START_X + (MAX_WIDTH / 3) * (depth + 1) - 180;
  const x4 = START_X + (MAX_WIDTH / 3) * (depth + 1);

  const scale = point.cost / data.cost;
  const thickness = scale * 300;
  const color = `#${genColor(y)}`;

  points.push({
    points: {
      x: [x1, x2, x3, x4],
      y: [y, y, newY, newY],
    },
    colorLeft: lastColor,
    colorRight: color,
    thickness,
    text: {
      title: point.name,
      subtitle: `$${(point.cost * 1000).toLocaleString()}`,
    },
    textScale: (() => {
      if (depth === 0) return 1.5;
      if (depth === 1) return 3 * (point.cost / data.cost);
      return 10 * (point.cost / data.cost);
    })(),
    leaf: !point.subcategories,
  });

  if (point.subcategories) {
    const WIDENING_FACTOR = 3;
    const total = point.cost;
    const start = newY - thickness / 2;
    let sum = 0;
    for (const subcategory of point.subcategories) {
      const height = sum + subcategory.cost / (total * 2);
      const tempY = start + height * thickness;
      const tempNewY =
        start +
        WIDENING_FACTOR * height * thickness -
        (thickness / 2) * (WIDENING_FACTOR - 1);
      getPoints(
        subcategory,
        depth + 1,
        tempY,
        tempNewY + childYOffset * thickness * 1.05,
        sum - 0.5,
        color,
        points,
      );
      sum += subcategory.cost / total;
    }
  }
  return points;
}

export const MAP_POINTS: MapPoint[] = getPoints(data);
