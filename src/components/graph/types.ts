interface Coord {
  x: number;
  y: number;
}

type NodeProps = {
  x: number;
  y: number;
};

type NodeStyle = {
  width: number;
  height: number;
  text: string;
  radius: number;
  outputPorts: number;
};

export type { Coord, NodeProps, NodeStyle };
