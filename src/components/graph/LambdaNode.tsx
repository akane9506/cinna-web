import AlignedPixiContainer from "@/components/graph/AlignedPixiContainer";
import type { NodeProps } from "@/components/graph/types";
import { Container, Point, type Graphics } from "pixi.js";
import { useCallback, useEffect, useRef } from "react";
import { COLOR_SCHEME, NODE_SIZES, PORT_SIZE } from "./shared";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import NodeName from "./NodeName";

const { w, h, r } = NODE_SIZES["lambda"];

const nodeStyle = {
  width: w,
  height: h,
  radius: r,
  cornerOffset: 30,
  text: "Lambda",
};

const gearStyle = {
  x: 40,
  y: 25,
  scale: 1.0,
  hoverX: 90,
  hoverY: 10,
  hoverScale: 1.1,
  innerRadius: 35,
  outerRadius: 50,
  numTeeth: 8,
  topLandOffset: 0.05,
  cornerRadius: 5,
  duration: 0.35,
};

export default function LambdaNode({ x, y, active }: NodeProps) {
  const { width, height, radius, cornerOffset, text } = nodeStyle;
  const gearRef = useRef<Container>(null);
  const { contextSafe } = useGSAP({ scope: gearRef });

  const expandNode = useCallback(() => {
    contextSafe(() => {
      if (!gearRef.current) return;
      const { hoverX, hoverY, hoverScale, duration } = gearStyle;
      gsap.killTweensOf(gearRef.current, "rotation");
      gsap.to(gearRef.current, {
        rotation: `+=${Math.PI * 2}`,
        duration: 2,
        ease: "none",
        repeat: -1,
      });
      gsap.to(gearRef.current, {
        x: hoverX,
        y: hoverY,
        duration,
        ease: "power2.out",
      });
      gsap.to(gearRef.current.scale, {
        x: hoverScale,
        y: hoverScale,
        duration,
        ease: "power2.out",
      });
    })();
  }, [contextSafe]);

  const foldNode = useCallback(() => {
    contextSafe(() => {
      if (!gearRef.current) return;
      const { x, y, scale, duration } = gearStyle;
      gsap.killTweensOf(gearRef.current, "rotation");
      gsap.to(gearRef.current, {
        x,
        y,
        duration,
        ease: "power2.out",
      });
      gsap.to(gearRef.current.scale, {
        x: scale,
        y: scale,
        duration,
        ease: "power2.out",
      });
    })();
  }, [contextSafe]);

  useEffect(() => {
    if (active) expandNode();
    else foldNode();
  }, [active, foldNode, expandNode]);

  const drawNode = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      graphics
        .roundShape(getCornerPoints(width, height, cornerOffset), radius)
        .fill({ color: COLOR_SCHEME.nodeBodyA })
        .stroke({ width: 2 });
    },
    [width, height, radius, cornerOffset],
  );

  const drawPorts = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      graphics.circle(0, 0, PORT_SIZE).fill("white");
      graphics.circle(width, 0, PORT_SIZE).fill("white");
    },
    [width],
  );

  const drawGear = useCallback((graphics: Graphics) => {
    const { innerRadius, outerRadius, topLandOffset, numTeeth, cornerRadius } = gearStyle;
    graphics.clear();
    graphics
      .roundShape(
        getGearPoints(innerRadius, outerRadius, numTeeth, topLandOffset),
        cornerRadius,
      )
      .fill({ color: COLOR_SCHEME.nodeBodyC })
      .stroke({ width: 2 })
      .circle(0, 0, 20) // the first cut removes the stroke
      .cut()
      .circle(0, 0, 20) // the second cut removes the center
      .cut();
  }, []);

  return (
    <AlignedPixiContainer
      x={x}
      y={y}
      nodeHeight={height}
      eventMode="static"
      cursor="pointer"
    >
      {/* Gear */}
      <pixiContainer
        ref={gearRef}
        x={gearStyle.x}
        y={gearStyle.y}
        scale={gearStyle.scale}
      >
        <pixiGraphics draw={drawGear} />
      </pixiContainer>

      <pixiContainer x={0} y={height / 2}>
        <pixiGraphics draw={drawPorts} />
      </pixiContainer>
      <pixiContainer eventMode="static" cursor="pointer">
        <pixiGraphics draw={drawNode} />
        {active && <NodeName text={text} nodeWidth={width} yShift={height / 2} />}
      </pixiContainer>
    </AlignedPixiContainer>
  );
}

function getGearPoints(innerR: number, outerR: number, numTeeth: number, offset: number) {
  const clampedNumTeeth = Math.min(8, Math.max(4, numTeeth));
  const radStep = (Math.PI * 2) / (clampedNumTeeth * 2);
  const points: Point[] = [];
  for (let i = 0; i < clampedNumTeeth * 2; i++) {
    if (i % 2 == 0) {
      const outerPt = getPolarCoord(i * radStep, offset, outerR, true);
      const innerPt = getPolarCoord(i * radStep, offset, innerR, false);
      points.push(outerPt);
      points.push(innerPt);
    } else {
      const outerPt = getPolarCoord(i * radStep, offset, outerR, false);
      const innerPt = getPolarCoord(i * radStep, offset, innerR, true);
      points.push(innerPt);
      points.push(outerPt);
    }
  }
  return points;
}

function getPolarCoord(
  radiance: number,
  teethOffset: number,
  radius: number,
  innerOffset: boolean,
): Point {
  return new Point(
    Math.cos(radiance + teethOffset * (innerOffset ? -1 : 1)) * radius,
    Math.sin(radiance + teethOffset * (innerOffset ? -1 : 1)) * radius,
  );
}

function getCornerPoints(width: number, height: number, offset: number): Point[] {
  const ptA = new Point(offset, 0);
  const ptB = new Point(width - offset, 0);
  const ptC = new Point(width, height / 2);
  const ptD = new Point(width - offset, height);
  const ptE = new Point(offset, height);
  const ptF = new Point(0, height / 2);
  return [ptA, ptB, ptC, ptD, ptE, ptF];
}
