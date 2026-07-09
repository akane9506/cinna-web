interface Coord {
  x: number;
  y: number;
}

interface NodeProps {
  x: number;
  y: number;
}

interface BaseNodeStyle {
  width: number;
  text: string;
  radius: number;
}

interface NodeStyle extends BaseNodeStyle {
  height: number;
}

interface BranchNodeStyle extends BaseNodeStyle {
  unitHeight: number;
  shrinkX: number;
  shrinkY: number;
}

export type { Coord, NodeProps, NodeStyle, BranchNodeStyle };
