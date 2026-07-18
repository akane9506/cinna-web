type NodeType = "io" | "chat" | "branch" | "json" | "lambda" | "state" | "workflow";
type ColorField =
  | "title"
  | "subtitle"
  | "edge"
  | "activeEdge"
  | "nodeBodyA"
  | "nodeBodyB"
  | "outline"
  | "nodeBodyC";

interface Coord {
  x: number;
  y: number;
}

interface BezierPoints {
  bStart: Coord;
  c1: Coord;
  c2: Coord;
  bEnd: Coord;
}

interface NodeProps {
  x: number;
  y: number;
  active?: boolean;
}

interface BaseNodeStyle {
  width: number;
  text: string;
  radius: number;
}

interface NodeStyle extends BaseNodeStyle {
  height: number;
}

export type {
  ColorField,
  NodeType,
  Coord,
  NodeProps,
  NodeStyle,
  BaseNodeStyle,
  BezierPoints,
};
