import { useCallback } from "react";
import { DEG_TO_RAD, type Graphics } from "pixi.js";
import type { NodeProps } from "@/components/graph/types";
import AlignedPixiContainer from "@/components/graph/AlignedPixiContainer";
import {
  COLOR_SCHEME,
  NODE_SHADOW_FILTER,
  NODE_SIZES,
  PORT_SIZE,
} from "@/components/graph/shared";
import NodeName from "./NodeName";

interface BranchNodeProps extends NodeProps {
  branches: number;
}

const { w, h, r } = NODE_SIZES["branch"];

const nodeStyle = {
  width: w,
  shrinkX: 40,
  shrinkY: 40,
  unitHeight: h,
  radius: r,
  text: "Branches",
};

export default function BranchNode({ x, y, branches, active }: BranchNodeProps) {
  const { width, unitHeight, radius, shrinkX, shrinkY, text } = nodeStyle;
  const clampedBranches = Math.min(3, Math.max(2, branches));
  const totalHeight = unitHeight * (clampedBranches + 1);

  const drawNode = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      graphics
        .roundShape(
          [
            { x: 0, y: shrinkY },
            { x: shrinkX, y: 0 },
            { x: width, y: 0 },
            { x: width, y: totalHeight },
            { x: shrinkX, y: totalHeight },
            { x: 0, y: totalHeight - shrinkY },
          ],
          radius,
        )
        .fill(COLOR_SCHEME.nodeBodyA)
        .stroke({ width: 2 });
    },
    [totalHeight, radius, width, shrinkX, shrinkY],
  );

  const drawPorts = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      // input port
      graphics.circle(0, totalHeight / 2, PORT_SIZE).fill("white");
      // output ports
      for (let yPos = unitHeight; yPos < totalHeight; yPos += unitHeight) {
        graphics.circle(width, yPos, PORT_SIZE).fill("white");
      }
    },
    [totalHeight, unitHeight, width],
  );

  return (
    <AlignedPixiContainer
      x={x}
      y={y}
      nodeHeight={totalHeight}
      filters={NODE_SHADOW_FILTER}
    >
      <pixiContainer>
        <pixiGraphics draw={drawPorts} />
      </pixiContainer>
      <pixiGraphics draw={drawNode} />
      {active && (
        <NodeName
          text={text}
          nodeWidth={width}
          yShift={totalHeight / 2}
          rotation={-90 * DEG_TO_RAD}
        />
      )}
    </AlignedPixiContainer>
  );
}
