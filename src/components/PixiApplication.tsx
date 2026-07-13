import "@/components/graph/pixi";
import gsap from "gsap";
import { useRef, type ReactElement } from "react";
import { Application } from "@pixi/react";
import { useGSAP } from "@gsap/react";
import IONode from "@/components/graph/IONode";
import ChatNode from "@/components/graph/ChatNode";
import BranchNode from "@/components/graph/BranchNode";
import LambdaNode from "@/components/graph/LambdaNode";
import StateNode from "@/components/graph/StateNode";
import WorkflowNode from "@/components/graph/WorkflowNode";
import JsonNode from "@/components/graph/JsonNode";
import Edge from "@/components/graph/Edge";
// import Edge from "@/components/graph/Edge";
// import AnimatedEdge from "@/components/graph/AnimatedEdge";
import { nodeRenderers, type NodeRenderer } from "@/components/graph/graph";

gsap.registerPlugin(useGSAP);

export default function PixiApplication() {
  const canvasParentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={canvasParentRef} className="w-full h-full">
      <Application
        resizeTo={canvasParentRef}
        background={0xb8c8d0}
        antialias
        autoDensity
        resolution={window.devicePixelRatio}
      >
        {/* Edges */}
        <Edge start={{ x: 100 + 160, y: 300 }} end={{ x: 440, y: 200 }} />
        {/*<AnimatedEdge end={{ x: 100 + 160, y: 300 }} start={{ x: 440, y: 200 }} />*/}
        <Edge start={{ x: 100 + 160, y: 300 }} end={{ x: 400, y: 420 }} />
        {/* Nodes */}
        {nodeRenderers.map((renderer) => renderNode(renderer))}
      </Application>
    </div>
  );
}

function renderNode(renderer: NodeRenderer): ReactElement {
  const { id, type, x, y, branches } = renderer;
  switch (type) {
    case "io":
      return <IONode key={id} x={x} y={y} />;
    case "chat":
      return <ChatNode key={id} x={x} y={y} />;
    case "state":
      return <StateNode key={id} x={x} y={y} />;
    case "branch":
      return <BranchNode key={id} x={x} y={y} branches={branches} />;
    case "json":
      return <JsonNode key={id} x={x} y={y} />;
    case "lambda":
      return <LambdaNode key={id} x={x} y={y} />;
    case "workflow":
      return <WorkflowNode key={id} x={x} y={y} />;
    default:
      return <></>;
  }
}
