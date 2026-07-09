import { Graphics } from "pixi.js";
import { useCallback } from "react";
import { PORT_SIZE } from "@/components/graph/shared";
import type { NodeStyle, NodeProps } from "@/components/graph/types";
import AlignedPixiContainer from "@/components/graph/AlignedPixiContainer";

const nodeStyle: NodeStyle = {
  width: 160,
  height: 60,
  radius: 20,
  text: "I/O Processor",
};

export default function IONode({ x, y }: NodeProps) {
  const { width, height, radius, text } = nodeStyle;
  const drawBody = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      // this is the base node
      graphics
        .roundRect(0, 0, width, height, radius)
        .fill({ color: "coral" })
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
    </AlignedPixiContainer>
  );
}
