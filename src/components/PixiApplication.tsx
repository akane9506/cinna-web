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
import Edge from "@/components/graph/Edge";
import AnimatedEdge from "@/components/graph/AnimatedEdge";

gsap.registerPlugin(useGSAP);

export default function PixiApplication() {
  const canvasParentRef = useRef<HTMLDivElement>(null);
  const [animatedEdges, setAnimatedEdges] = useState<typeof nodeEdges>(animatedNodeEdges);

  const handleUpdateAnimatedEdges = (node: NodeRenderer) => {
    const newEdges = drawEdges(node.node);
    setAnimatedEdges(newEdges);
  };

  return (
    <div ref={canvasParentRef} className="w-full h-full">
      <Application
        resizeTo={canvasParentRef}
        background={"lightgray"}
        antialias
        autoDensity
        resolution={window.devicePixelRatio}
      >
        {/* Edges */}
        {nodeEdges.map((edge) => (
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
            {renderNode(renderer)}
          </pixiContainer>
        ))}
      </Application>
    </div>
  );
}

function renderNode(renderer: NodeRenderer): ReactElement {
  const { type, x, y, branches } = renderer;
  const props = { x, y, branches };
  switch (type) {
    case "io":
      return <IONode x={x} y={y} />;
    case "chat":
      return <ChatNode {...props} />;
    case "state":
      return <StateNode x={x} y={y} />;
    case "branch":
      return <BranchNode x={x} y={y} branches={branches} />;
    case "json":
      return <JsonNode x={x} y={y} />;
    case "lambda":
      return <LambdaNode x={x} y={y} />;
    case "workflow":
      return <WorkflowNode x={x} y={y} />;
    default:
      return <></>;
  }
}
