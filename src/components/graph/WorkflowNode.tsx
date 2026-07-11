import { useCallback, useRef } from "react";
import AlignedPixiContainer from "./AlignedPixiContainer";
import type { NodeProps } from "./types";
import { Container, Point, type Graphics } from "pixi.js";
import { PORT_SIZE } from "./shared";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const nodeStyle = {
  width: 180,
  height: 130,
  radius: 12,
  text: "Workflow",
  hoverScale: 1.2,
};
export default function WorkflowNode({ x, y }: NodeProps) {
  const { width, radius, text, height } = nodeStyle;

  const containerRef = useRef<Container>(null);
  const nodeShapeRef = useRef<Graphics>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleNodeHoverIn = () => {
    contextSafe(() => {
      if (!nodeShapeRef.current) return;
      const { hoverScale } = nodeStyle;
      gsap.to(nodeShapeRef.current.scale, {
        x: 1.0,
        y: hoverScale,
        duration: 0.35,
        ease: "elastic.out",
      });
    })();
  };

  const handleNodeHoverOut = () => {
    contextSafe(() => {
      if (!nodeShapeRef.current) return;
      gsap.to(nodeShapeRef.current.scale, {
        x: 1.0,
        y: 1.0,
        duration: 0.35,
        ease: "elastic.out",
      });
    })();
  };

  const drawNode = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      graphics
        .roundShape(getDiamondCorners(width, height), radius)
        .fill("coral")
        .stroke({ width: 2 });
    },
    [width, height, radius],
  );

  const drawPorts = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      graphics.circle(8, 0, PORT_SIZE).fill("white");
      graphics.circle(width - 8, 0, PORT_SIZE).fill("white");
    },
    [width],
  );

  return (
    <AlignedPixiContainer
      ref={containerRef}
      x={x}
      y={y}
      nodeHeight={height}
      eventMode="static"
      onPointerOver={handleNodeHoverIn}
      onPointerOut={handleNodeHoverOut}
    >
      <pixiContainer x={0} y={height / 2}>
        <pixiGraphics draw={drawPorts} />
      </pixiContainer>
      <pixiContainer x={0} y={height / 2}>
        <pixiGraphics ref={nodeShapeRef} draw={drawNode} />
      </pixiContainer>
      <pixiText
        text={text}
        x={width / 2}
        y={height / 2}
        anchor={0.5}
        style={{ fontSize: 19, fill: "white" }}
      />
    </AlignedPixiContainer>
  );
}

function getDiamondCorners(width: number, height: number): Point[] {
  const ptA = new Point(0, 0);
  const ptB = new Point(width / 2, -height / 2);
  const ptC = new Point(width, 0);
  const ptD = new Point(width / 2, height / 2);
  return [ptA, ptB, ptC, ptD];
}
