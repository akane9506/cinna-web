import { useCallback, useEffect, useRef } from "react";
import type { NodeProps } from "./types";
import { Container, Graphics, Point } from "pixi.js";
import AlignedPixiContainer from "./AlignedPixiContainer";
import { COLOR_SCHEME, NODE_SHADOW_FILTER, NODE_SIZES, PORT_SIZE } from "./shared";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import NodeName from "./NodeName";

const { w, h, r } = NODE_SIZES["json"];

const nodeStyle = {
  width: w,
  height: h,
  radius: r,
  xOffset: 12,
  yOffset: 5,
  hoverXOffset: 40,
  hoverYOffset: 12,
  text: "JSON",
};

export default function JsonNode({ x, y, active }: NodeProps) {
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
        .fill(COLOR_SCHEME.nodeBodyB)
        .stroke({ width: 2 });
      graphics
        .roundShape(getCornerPoints(width, height, xOffset, -yOffset), radius)
        .fill(COLOR_SCHEME.nodeBodyA)
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

  const redrawNode = useCallback(() => {
    if (!nodeRef.current) return;
    drawNode(nodeRef.current);
  }, [drawNode]);

  const expandNode = useCallback(() => {
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
  }, [contextSafe, redrawNode]);

  const foldNode = useCallback(() => {
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
  }, [contextSafe, redrawNode]);

  useEffect(() => {
    if (active) expandNode();
    else foldNode();
  }, [active, expandNode, foldNode]);

  return (
    <AlignedPixiContainer
      ref={containerRef}
      x={x}
      y={y}
      eventMode="static"
      nodeHeight={height}
      filters={NODE_SHADOW_FILTER}
    >
      <pixiContainer x={0} y={height / 2}>
        <pixiGraphics draw={drawPorts} />
      </pixiContainer>
      <pixiContainer>
        <pixiGraphics ref={nodeRef} draw={drawNode} />
        {active && (
          <NodeName
            nodeWidth={width}
            text={text}
            yShift={height / 2 - nodeStyle.yOffset}
          />
        )}
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
