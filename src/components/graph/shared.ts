import type { NodeType, Coord, BezierPoints, ColorField } from "./types";

const PORT_SIZE = 10;

const NODE_SIZES: Record<NodeType, { w: number; h: number; r: number }> = {
  io: { w: 150, h: 50, r: 12 },
  chat: { w: 140, h: 90, r: 12 },
  lambda: { w: 140, h: 80, r: 12 },
  json: { w: 140, h: 80, r: 6 },
  workflow: { w: 170, h: 100, r: 12 },
  state: { w: 90, h: 0, r: 0 }, // for state node, w means diameter
  branch: { w: 80, h: 50, r: 12 }, // h for branch means unit height
};

const COLOR_SCHEME: Record<ColorField, number> = {
  nodeBodyA: 0xa09cc1,
  nodeBodyB: 0x99b6b2,
  nodeBodyC: 0xd38882,
  edge: 0x99c2db,
  activeEdge: 0xa7bee0,
  outline: 0xffffff,
};

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

export { PORT_SIZE, NODE_SIZES, COLOR_SCHEME };
export { yAlign, getBezierPoints };
