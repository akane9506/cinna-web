import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCallback, useRef } from "react";
import { Container, Point, type Graphics } from "pixi.js";
import AlignedPixiContainer from "@/components/graph/AlignedPixiContainer";
import type { NodeProps } from "@/components/graph/types";
import { NODE_SIZES, PORT_SIZE } from "@/components/graph/shared";

const { w, h, r } = NODE_SIZES["workflow"];

const nodeStyle = {
  width: w,
  height: h,
  radius: r,
  text: "Workflow",
  hoverScale: 1.2,
};

const subNodeStyle = {
  width: 70,
  height: 40,
  radius: 6,
  hoverOffsetX: 80,
  hoverOffsetY: 145,
  hoverOffsetYCenter: 155,
};

export default function WorkflowNode({ x, y }: NodeProps) {
  const { width, radius, text, height } = nodeStyle;

  const containerRef = useRef<Container>(null);
  const nodeShapeRef = useRef<Graphics>(null);
  const subnodesContainerRef = useRef<Container>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const redrawSubNodes = () => {
    if (!subnodesContainerRef.current) return;
    subnodesContainerRef.current.children.map((node) => {
      drawSubNode(node as Graphics);
    });
  };

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

      if (!subnodesContainerRef.current) return;
      const { hoverOffsetX, hoverOffsetY, hoverOffsetYCenter } = subNodeStyle;
      gsap.to(subnodesContainerRef.current.children, {
        x: (index) => [0, hoverOffsetX, -hoverOffsetX][index],
        y: (index) => [hoverOffsetYCenter, hoverOffsetY, hoverOffsetY][index],
        duration: 0.35,
        ease: "elastic.out",
        onUpdate: redrawSubNodes,
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
      if (!subnodesContainerRef.current) return;
      gsap.to(subnodesContainerRef.current.children, {
        x: 0,
        y: height / 2,
        duration: 0.35,
        ease: "power2.out",
        onUpdate: redrawSubNodes,
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

  const drawSubNode = useCallback((graphics: Graphics) => {
    const { width, height, radius } = subNodeStyle;
    graphics.clear();
    const centeredDiamond = getDiamondCorners(width, height);
    centeredDiamond.forEach((point) => (point.x -= width / 2));
    const position = graphics.position;
    graphics.roundShape(centeredDiamond, radius).fill("coral").stroke({ width: 2 });
    graphics
      .moveTo(-position.x, -position.y / 2)
      .bezierCurveTo(
        -position.x,
        -position.y / 2 + subNodeStyle.hoverOffsetY / 3,
        centeredDiamond[1].x,
        centeredDiamond[1].y - subNodeStyle.hoverOffsetY / 3,
        centeredDiamond[1].x,
        centeredDiamond[1].y,
      )
      .stroke({ width: 2 });
  }, []);

  const drawPorts = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      graphics.circle(8, 0, PORT_SIZE).fill("white");
      graphics.circle(width - 8, 0, PORT_SIZE).fill("white");
    },
    [width],
  );

  return (
    <AlignedPixiContainer ref={containerRef} x={x} y={y} nodeHeight={height}>
      {/* Sub nodes */}
      <pixiContainer ref={subnodesContainerRef} x={width / 2}>
        {Array.from({ length: 3 }, (_, index) => index).map((idx) => {
          return (
            <pixiGraphics
              key={`subnode-${idx}`} // actually we can ignore the key; it is not even a DOM
              x={0}
              y={height / 2}
              draw={drawSubNode}
            />
          );
        })}
      </pixiContainer>
      {/* Ports */}
      <pixiContainer x={0} y={height / 2}>
        <pixiGraphics draw={drawPorts} />
      </pixiContainer>
      {/* Node body */}
      <pixiContainer
        x={0}
        y={height / 2}
        eventMode="static"
        cursor="pointer"
        onPointerOver={handleNodeHoverIn}
        onPointerOut={handleNodeHoverOut}
      >
        <pixiGraphics ref={nodeShapeRef} draw={drawNode} />
        <pixiText
          text={text}
          x={width / 2}
          y={0}
          anchor={0.5}
          style={{ fontSize: 19, fill: "white" }}
        />
      </pixiContainer>
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
