// import { FillGradient } from "pixi.js";
import { FillGradient } from "pixi.js";
import type { NodeType, Coord, BezierPoints, ColorField } from "./types";
import { DropShadowFilter } from "pixi-filters/drop-shadow";

const PORT_SIZE = 10;

const NODE_SIZES: Record<NodeType, { w: number; h: number; r: number }> = {
  io: { w: 150, h: 55, r: 6 },
  chat: { w: 140, h: 90, r: 6 },
  lambda: { w: 140, h: 80, r: 6 },
  json: { w: 140, h: 80, r: 6 },
  workflow: { w: 170, h: 100, r: 6 },
  state: { w: 90, h: 0, r: 0 }, // for state node, w means diameter
  branch: { w: 80, h: 50, r: 6 }, // h for branch means unit height
};

const COLOR_PALETTE = [
  0x304868, // dark blue
  0x7890a8, // light blue
  0xe8a8a0, // light red
  0xa8b8a8, // light green
  0xe04848, // warning red
  0xd0d0d0, // light gray
  0xf8b880, // bright yellow
];

const COLOR_SCHEME: Record<ColorField, number> = {
  title: COLOR_PALETTE[0],
  subtitle: COLOR_PALETTE[3],
  nodeBodyA: COLOR_PALETTE[1],
  nodeBodyB: COLOR_PALETTE[2],
  nodeBodyC: COLOR_PALETTE[3],
  edge: COLOR_PALETTE[5],
  activeEdge: COLOR_PALETTE[1],
  outline: 0xffffff,
};

const GRAPH_EDGE_GRADIENT = new FillGradient({
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
  colorStops: [
    { offset: 0, color: COLOR_PALETTE[6] },
    { offset: 1, color: COLOR_PALETTE[2] },
  ],
});

const NODE_SHADOW_FILTER = new DropShadowFilter({
  offset: { x: 2, y: 3 },
  blur: 4,
  quality: 5,
  resolution: 2,
  color: COLOR_PALETTE[0],
});

const yAlign = (y: number | undefined, nodeHeight: number) => {
  return (y || 0) - nodeHeight / 2;
};

// Get Bezier points for the complete, untrimmed curve
const getBezierPoints = (start: Coord, end: Coord): BezierPoints => {
  const dir = end.x > start.x ? 1 : -1;
  const distance = Math.abs(end.x - start.x);
  const offset = Math.max(40, distance * 0.8) * dir;
  const p0: Coord = { x: start.x, y: start.y };
  const p1: Coord = { x: start.x + offset, y: start.y };
  const p2: Coord = { x: end.x - offset, y: end.y };
  const p3: Coord = { x: end.x, y: end.y };
  return { bStart: p0, c1: p1, c2: p2, bEnd: p3 };
};

export {
  PORT_SIZE,
  NODE_SIZES,
  NODE_SHADOW_FILTER,
  COLOR_SCHEME,
  COLOR_PALETTE,
  GRAPH_EDGE_GRADIENT,
};
export { yAlign, getBezierPoints };
