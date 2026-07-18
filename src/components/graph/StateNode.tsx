import { useCallback } from "react";
import AlignedPixiContainer from "./AlignedPixiContainer";
import type { NodeProps } from "./types";
import type { Graphics } from "pixi.js";
import { COLOR_SCHEME, NODE_SHADOW_FILTER, NODE_SIZES, PORT_SIZE } from "./shared";
import NodeName from "./NodeName";

const { w } = NODE_SIZES["state"];

const nodeStyle = {
  diameter: w,
  text: "State",
};

export default function StateNode({ x, y, active }: NodeProps) {
  const { diameter, text } = nodeStyle;
  const radius = diameter / 2;
  const drawNode = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      graphics.circle(0, 0, radius).fill(COLOR_SCHEME.nodeBodyC).stroke({ width: 2 });
    },
    [radius],
  );
  const drawPorts = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      graphics.circle(0, 0, PORT_SIZE).fill("white");
      graphics.circle(diameter, 0, PORT_SIZE).fill("white");
    },
    [diameter],
  );

  return (
    <AlignedPixiContainer x={x} y={y} nodeHeight={diameter} filters={NODE_SHADOW_FILTER}>
      <pixiContainer x={0} y={radius}>
        <pixiGraphics draw={drawPorts} />
      </pixiContainer>
      <pixiContainer x={radius} y={radius}>
        <pixiGraphics draw={drawNode} />
        {active && <NodeName text={text} nodeWidth={0} />}
      </pixiContainer>
    </AlignedPixiContainer>
  );
}
