import { Application } from "@pixi/react";
import "./pixi";
import Node from "./graph/Node";
import { useRef } from "react";
import Edge from "./graph/Edge";
import { Point } from "pixi.js";
import AnimatedEdge from "./graph/AnimatedEdge";

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
        <Edge start={new Point(300, 100 + 70)} end={new Point(500, 320 + 70)} />
        <AnimatedEdge start={new Point(300, 100 + 70)} end={new Point(500, 320 + 70)} />
        <Node x={100} y={100} nodeType="IO" />
        <Node x={500} y={320} nodeType="IO" />
      </Application>
    </div>
  );
}
