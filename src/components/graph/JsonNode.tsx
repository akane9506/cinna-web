import { useCallback, useRef } from "react";
import type { NodeProps } from "./types";
import { Container, Graphics, Point } from "pixi.js";
import AlignedPixiContainer from "./AlignedPixiContainer";
import { NODE_SIZES, PORT_SIZE } from "./shared";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const { w, h, r } = NODE_SIZES["json"];

const nodeStyle = {
  width: w,
  height: h,
  radius: r,
  xOffset: 12,
  yOffset: 5,
  hoverXOffset: 40,
  hoverYOffset: 12,
  text: "JSON Model",
};

export default function JsonNode({ x, y }: NodeProps) {
  const { width, height, radius, text } = nodeStyle;
  const containerRef = useRef<Container>(null);
  const nodeRef = useRef<Graphics>(null);
  const nodeShapeRef = useRef<{ xOffset: number; yOffset: number }>({
    xOffset: nodeStyle.xOffset,
    yOffset: nodeStyle.yOffset,
  });
  const drawNode = useCallback(
    (graphics: Graphics) => {
      const { xOffset, yOffset } = nodeShapeRef.current;
      graphics.clear();
      graphics
        .roundShape(getCornerPoints(width, height, -xOffset, yOffset), radius)
        .fill("coral")
        .stroke({ width: 2 });
      graphics
        .roundShape(getCornerPoints(width, height, xOffset, -yOffset), radius)
        .fill("coral")
        .stroke({ width: 2 });
    },
    [width, height, radius],
  );

  // draw node ports
  const drawPorts = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      graphics.circle(0, 0, PORT_SIZE).fill("white");
      graphics.circle(width, 0, PORT_SIZE).fill("white");
    },
    [width],
  );

  const { contextSafe } = useGSAP({ scope: containerRef });

  const redrawNode = () => {
    if (!nodeRef.current) return;
    drawNode(nodeRef.current);
  };

  const handleNodeHoverIn = () => {
    contextSafe(() => {
      const { hoverXOffset, hoverYOffset } = nodeStyle;
      gsap.to(nodeShapeRef.current, {
        xOffset: hoverXOffset,
        yOffset: hoverYOffset,
        duration: 0.35,
        ease: "elastic.out",
        onUpdate: redrawNode,
      });
    })();
  };

  const handleNodeHoverOut = () => {
    contextSafe(() => {
      const { xOffset, yOffset } = nodeStyle;
      gsap.to(nodeShapeRef.current, {
        xOffset: xOffset,
        yOffset: yOffset,
        duration: 0.35,
        ease: "elastic.out",
        onUpdate: redrawNode,
      });
    })();
  };

  return (
    <AlignedPixiContainer
      ref={containerRef}
      x={x}
      y={y}
      eventMode="static"
      onPointerOver={handleNodeHoverIn}
      onPointerOut={handleNodeHoverOut}
      nodeHeight={height}
    >
      <pixiContainer x={0} y={height / 2}>
        <pixiGraphics draw={drawPorts} />
      </pixiContainer>
      <pixiContainer>
        <pixiGraphics ref={nodeRef} draw={drawNode} />
        <pixiText
          text={text}
          x={width / 2}
          y={height / 2}
          anchor={0.5}
          style={{
            fontSize: 19,
            fill: "white",
          }}
        />
      </pixiContainer>
    </AlignedPixiContainer>
  );
}

function getCornerPoints(
  width: number,
  height: number,
  xOffset: number,
  yOffset: number,
): Point[] {
  const ptA = new Point(xOffset / 2, 0 + yOffset);
  const ptB = new Point(width + xOffset / 2, 0 + yOffset);
  const ptC = new Point(width - xOffset / 2, height + yOffset);
  const ptD = new Point(-xOffset / 2, height + yOffset);
  return [ptA, ptB, ptC, ptD];
}
