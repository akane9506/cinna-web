import { Graphics } from "pixi.js";
import { useCallback } from "react";
import { COLOR_SCHEME, NODE_SIZES, PORT_SIZE } from "@/components/graph/shared";
import type { NodeProps } from "@/components/graph/types";
import AlignedPixiContainer from "@/components/graph/AlignedPixiContainer";
import NodeName from "./NodeName";

const { w, h, r } = NODE_SIZES.io;

const nodeStyle = {
  width: w,
  height: h,
  radius: r,
  text: "I/O Processor",
};

export default function IONode({ x, y, active }: NodeProps) {
  const { width, height, radius, text } = nodeStyle;
  const drawBody = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      // this is the base node
      graphics
        .roundRect(0, 0, width, height, radius)
        .fill(COLOR_SCHEME.nodeBodyB)
        .stroke({ width: 2 });
    },
    [width, height, radius],
  );

  const drawPorts = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      graphics.circle(0, 0, PORT_SIZE).fill("white");
      graphics.circle(width, 0, PORT_SIZE).fill("white");
    },
    [width],
  );

  return (
    <AlignedPixiContainer x={x} y={y} nodeHeight={nodeStyle.height}>
      <pixiContainer x={0} y={height / 2}>
        <pixiGraphics draw={drawPorts} />
      </pixiContainer>
      <pixiGraphics draw={drawBody} />
      {active && <NodeName text={text} nodeWidth={width} yShift={height / 2} />}
    </AlignedPixiContainer>
  );
}
