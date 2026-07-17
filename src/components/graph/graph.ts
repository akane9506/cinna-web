import { NODE_SIZES } from "./shared";
import type { Coord, NodeType } from "./types";

type NodeRenderer = {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  active: boolean; //use this to control fadeout
  branches: number;
  node: GraphNode;
};

type EdgeRenderer = {
  id: string;
  start: Coord;
  end: Coord;
  depth: number;
};

class GraphNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  branches: number;
  parents: GraphNode[];
  children: GraphNode[];
  endPoints: Coord[];

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
    this.endPoints = this.getEndPoints();
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

// add parents to each node
const buildRelationship = (node: GraphNode) => {
  const built = new Set<string>();
  const traverseChildren = (node: GraphNode) => {
    node.children.forEach((child) => {
      child.parents.push(node);
      if (built.has(child.id)) return;
      built.add(child.id);
      traverseChildren(child);
    });
  };
  traverseChildren(node);
};

const drawNodes = (head: GraphNode): NodeRenderer[] => {
  const output: NodeRenderer[] = [];
  const nodes = [head];
  const drawn = new Set<string>();
  while (nodes.length != 0) {
    const currentNode = nodes.shift();
    if (currentNode == undefined) {
      continue;
    }
    if (drawn.has(currentNode.id)) continue;
    drawn.add(currentNode.id);
    output.push({
      id: currentNode.id,
      type: currentNode.type,
      x: currentNode.x,
      y: currentNode.y,
      active: true,
      branches: currentNode.branches,
      node: currentNode,
    });
    currentNode.children.forEach((child) => nodes.push(child));
  }
  return output;
};

const drawEdges = (head: GraphNode): EdgeRenderer[] => {
  const output: EdgeRenderer[] = [];
  const drawn = new Set<string>([]);
  // get edges for children
  const traverseChildren = (node: GraphNode, depth: number) => {
    const { endPoints } = node;
    const numEndPoints = endPoints.length;
    node.children.forEach((child, index) => {
      const edgeStart = endPoints[Math.min(index, numEndPoints - 1)];
      const edgeEnd: Coord = { x: child.x, y: child.y };
      output.push({
        id: `child-${node.id}-${child.id}`,
        start: edgeStart,
        end: edgeEnd,
        depth,
      });
      if (drawn.has(child.id)) return;
      drawn.add(child.id);
      traverseChildren(child, depth + 1);
    });
  };

  const traverseParents = (node: GraphNode, depth: number) => {
    const { x: startX, y: startY, id } = node;
    const edgeStart: Coord = { x: startX, y: startY };
    node.parents.forEach((parent) => {
      const nthChild = parent.children.findIndex((child) => child.id == id);
      const coord = parent.endPoints[Math.min(nthChild, parent.endPoints.length - 1)];
      const edgeEnd: Coord = { x: coord.x, y: coord.y };
      output.push({
        id: `parent-${id}-${parent.id}`,
        start: edgeStart,
        end: edgeEnd,
        depth,
      });
      if (drawn.has(parent.id)) return;
      drawn.add(parent.id);
      traverseParents(parent, depth + 1);
    });
  };

  traverseChildren(head, 0);
  // drawn.clear();
  traverseParents(head, 0);
  return output;
};

// create nodes
const head = new GraphNode("head", "io", 100, 360, []);
const chat1 = new GraphNode("chat1", "chat", 380, 200, []);
const branch1 = new GraphNode("branch1", "branch", 380, 450, [], 2);

const state1 = new GraphNode("state1", "state", 600, 350, []);
const workflow1 = new GraphNode("workflow1", "workflow", 560, 550, []);

const json1 = new GraphNode("json1", "json", 800, 300, []);
const branch2 = new GraphNode("branch2", "branch", 800, 520, [], 3);
const workflow2 = new GraphNode("workflow2", "workflow", 800, 100, []);

const state2 = new GraphNode("state2", "state", 1050, 360, []);
const io2 = new GraphNode("io2", "io", 1050, 720, []);
const lambda1 = new GraphNode("lambda1", "lambda", 1200, 280, []);

const chat2 = new GraphNode("chat2", "chat", 1200, 520, []);
const lambda2 = new GraphNode("lambda2", "lambda", 950, 520, []);

//  create graph
head.children = [chat1, branch1];
branch1.children = [state1, workflow1];
chat1.children = [json1, workflow2];
state1.children = [json1];
json1.children = [state2];
workflow1.children = [branch2];
branch2.children = [state2, lambda2, io2];
lambda2.children = [chat2];
workflow2.children = [lambda1];
state2.children = [lambda1];

// build graph and draw nodes
buildRelationship(head);
const nodeRenderers = drawNodes(head);
const nodeEdges = drawEdges(head);

const animatedNodeEdges = drawEdges(json1);

export { nodeRenderers, nodeEdges, animatedNodeEdges, drawEdges };
export type { NodeRenderer };
