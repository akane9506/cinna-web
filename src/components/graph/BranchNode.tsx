import { useCallback } from "react";
import { DEG_TO_RAD, type Graphics } from "pixi.js";
import type { BranchNodeStyle, NodeProps } from "@/components/graph/types";
import AlignedPixiContainer from "@/components/graph/AlignedPixiContainer";
import { PORT_SIZE } from "./shared";

interface BranchNodeProps extends NodeProps {
  branches: number;
}

const nodeStyle: BranchNodeStyle = {
  width: 80,
  shrinkX: 40,
  shrinkY: 40,
  unitHeight: 50,
  radius: 16,
  text: "Branches",
};

export default function BranchNode({ x, y, branches }: BranchNodeProps) {
  const { width, unitHeight, radius, text, shrinkX, shrinkY } = nodeStyle;
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
        .fill({ color: "coral" })
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
    <AlignedPixiContainer x={x} y={y} nodeHeight={totalHeight}>
      <pixiContainer>
        <pixiGraphics draw={drawPorts} />
      </pixiContainer>
      <pixiGraphics draw={drawNode} />
      <pixiText
        text={text}
        x={width / 2}
        y={totalHeight / 2}
        anchor={0.5}
        rotation={-90 * DEG_TO_RAD}
        style={{
          fontSize: 19,
          fill: "white",
        }}
      />
    </AlignedPixiContainer>
  );
}
