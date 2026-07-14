import "@/components/graph/pixi";
import gsap from "gsap";
import { useRef, useState, type ReactElement } from "react";
import { Application } from "@pixi/react";
import { useGSAP } from "@gsap/react";
import {
  nodeRenderers,
  nodeEdges,
  type NodeRenderer,
  animatedNodeEdges,
  drawEdges,
} from "@/components/graph/graph";
import IONode from "@/components/graph/IONode";
import ChatNode from "@/components/graph/ChatNode";
import BranchNode from "@/components/graph/BranchNode";
import LambdaNode from "@/components/graph/LambdaNode";
import StateNode from "@/components/graph/StateNode";
import WorkflowNode from "@/components/graph/WorkflowNode";
import JsonNode from "@/components/graph/JsonNode";
import AnimatedEdge from "@/components/graph/AnimatedEdge";
import Edge from "./graph/Edge";

gsap.registerPlugin(useGSAP);

export default function PixiApplication() {
  const canvasParentRef = useRef<HTMLDivElement>(null);
  const [animatedEdges, setAnimatedEdges] = useState<typeof nodeEdges>(animatedNodeEdges);

  const handleUpdateAnimatedEdges = (node: NodeRenderer) => {
    const newEdges = drawEdges(node.node);
    setAnimatedEdges(newEdges);
  };

  const getActiveNodes = () => {
    const activeNodes = new Set<string>();
    animatedEdges.forEach((edge) => {
      const [, from, to] = edge.id.split("-");
      activeNodes.add(from);
      activeNodes.add(to);
    });
    return activeNodes;
  };
  const activeNodes = getActiveNodes();

  return (
    <div ref={canvasParentRef} className="w-full h-full">
      <Application
        resizeTo={canvasParentRef}
        background={0xf1f0ed}
        antialias
        autoDensity
        resolution={window.devicePixelRatio}
      >
        {/* Edges */}
        {animatedEdges.map((edge) => (
          <Edge key={edge.id} start={edge.start} end={edge.end} />
        ))}
        {/* Animated Edges */}
        {animatedEdges.map((edge) => (
          <AnimatedEdge
            key={edge.id}
            start={edge.start}
            end={edge.end}
            depth={edge.depth}
          />
        ))}
        {/* Nodes */}
        {nodeRenderers.map((renderer) => (
          <pixiContainer
            eventMode="static"
            onPointerEnter={() => handleUpdateAnimatedEdges(renderer)}
            key={renderer.id}
          >
            {renderNode(renderer, activeNodes)}
          </pixiContainer>
        ))}
      </Application>
    </div>
  );
}

function renderNode(renderer: NodeRenderer, activeNodes: Set<string>): ReactElement {
  const { type, x, y, branches, id } = renderer;
  const active = activeNodes.has(id);
  const props = { x, y, branches, active };
  switch (type) {
    case "io":
      return <IONode {...props} />;
    case "chat":
      return <ChatNode {...props} />;
    case "state":
      return <StateNode {...props} />;
    case "branch":
      return <BranchNode {...props} />;
    case "json":
      return <JsonNode {...props} />;
    case "lambda":
      return <LambdaNode {...props} />;
    case "workflow":
      return <WorkflowNode {...props} />;
    default:
      return <></>;
  }
}
