import "@/components/graph/pixi";
import gsap from "gsap";
import { useRef } from "react";
import { Application } from "@pixi/react";
import { useGSAP } from "@gsap/react";
import IONode from "@/components/graph/IONode";
import ChatNode from "@/components/graph/ChatNode";
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
        <IONode x={100} y={100} />
        <ChatNode x={400} y={100} />
      </Application>
    </div>
  );
}
