import type { Graphics } from "pixi.js";
import { useCallback } from "react";

type NodeType = "IO" | "lambda" | "chat" | "json";

type NodeProps = {
  x: number;
  y: number;
  nodeType: NodeType;
};

// type NodeStyle = {
//   width: number
//   height: number
// }

export default function Node({ x, y }: NodeProps) {
  const [width, height, portRadius] = [200, 140, 10];
  const drawBody = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      // this is the base node
      graphics
        .roundRect(0, 0, width, height)
        .fill({ color: "coral" })
        .stroke({ width: 2 });
    },
    [width, height],
  );

  const drawPorts = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      graphics.circle(0, 0, portRadius).fill("white");
      graphics.circle(width, 0, portRadius).fill("white");
    },
    [portRadius, width],
  );

  return (
    <pixiContainer x={x} y={y}>
      <pixiContainer x={0} y={height / 2}>
        <pixiGraphics draw={drawPorts} />
      </pixiContainer>
      <pixiGraphics draw={drawBody} />
      <pixiText text={"I/O Processor"} x={width / 2} y={height / 2} anchor={0.5} />
    </pixiContainer>
  );
}
