import { NODE_SIZES } from "./shared";
import type { Coord, NodeType } from "./types";

type NodeRenderer = {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  active: boolean; //use this to control fadeout
  branches: number;
};

class GraphNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  branches: number;
  parents: GraphNode[];
  children: GraphNode[];

  constructor(
    id: string,
    type: NodeType,
    x: number,
    y: number,
    next: GraphNode[],
    branches: number = 1,
  ) {
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    this.children = next;
    this.branches = branches;
    this.parents = [];
  }

  getEndPoints(): Coord[] {
    const endPoints: Coord[] = [];
    if (this.type !== "branch") {
      endPoints.push({ x: this.x + NODE_SIZES[this.type].w, y: this.y });
    } else {
      const { w, h } = NODE_SIZES[this.type];
      const totalHeight = h * (this.branches + 1);
      for (let i = 0; i < this.branches; i++) {
        const x = this.x + w;
        const y = this.y - totalHeight / 2 + (i + 1) * h;
        endPoints.push({ x, y });
      }
    }
    return endPoints;
  }
}

// create nodes
const head = new GraphNode("head", "io", 100, 300, []);
const chat1 = new GraphNode("chat1", "chat", 440, 200, []);
const branch1 = new GraphNode("branch1", "branch", 400, 420, [], 2);
const state1 = new GraphNode("state1", "state", 560, 360, []);

//  create graph
head.children = [chat1, branch1];
branch1.children = [state1];

// add parents to each node
const buildRelationship = (head: GraphNode) => {
  head.children.forEach((child) => {
    child.parents.push(head);
    buildRelationship(child);
  });
};

const drawNodes = (head: GraphNode): NodeRenderer[] => {
  const output: NodeRenderer[] = [];
  const nodes = [head];
  while (nodes.length != 0) {
    const currentNode = nodes.shift();
    if (currentNode == undefined) {
      continue;
    }
    output.push({
      id: currentNode.id,
      type: currentNode.type,
      x: currentNode.x,
      y: currentNode.y,
      active: true,
      branches: currentNode.branches,
    });
    currentNode.children.forEach((child) => nodes.push(child));
  }
  return output;
};

// const drawEdges = (head: GraphNode):

// build graph and draw nodes
buildRelationship(head);
const nodeRenderers = drawNodes(head);

export { nodeRenderers };
export type { NodeRenderer };
