import "@/components/graph/pixi";
import gsap from "gsap";
import { useRef } from "react";
import { Application } from "@pixi/react";
import { useGSAP } from "@gsap/react";
import IONode from "@/components/graph/IONode";
import ChatNode from "@/components/graph/ChatNode";
import BranchNode from "./graph/BranchNode";
import LambdaNode from "./graph/LambdaNode";
import StateNode from "./graph/StateNode";
import WorkflowNode from "./graph/WorkflowNode";
// import Edge from "@/components/graph/Edge";
// import AnimatedEdge from "@/components/graph/AnimatedEdge";

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
        {/*<Edge start={{x: 300, y: 100 + 70}} end={{x: 500, y: 320 + 70}} />*/}
        {/*<AnimatedEdge start={{x: 300, y: 100 + 70}} end={{x: 500, y: 320 + 70}} />*/}
        <IONode x={100} y={200} />
        <ChatNode x={400} y={200} />
        <BranchNode x={700} y={200} branches={2} />
        <LambdaNode x={960} y={200} />
        <StateNode x={100} y={400} />
        <WorkflowNode x={400} y={400} />
      </Application>
    </div>
  );
}
