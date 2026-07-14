import { useCallback } from "react";
import AlignedPixiContainer from "./AlignedPixiContainer";
import type { NodeProps } from "./types";
import type { Graphics } from "pixi.js";
import { COLOR_SCHEME, NODE_SIZES, PORT_SIZE } from "./shared";

const { w } = NODE_SIZES["state"];

const nodeStyle = {
  diameter: w,
  text: "State",
};

export default function StateNode({ x, y }: NodeProps) {
  const { diameter } = nodeStyle;
  const radius = diameter / 2;
  const drawNode = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      graphics
        .circle(0, 0, radius)
        .fill({ color: COLOR_SCHEME.nodeBodyB })
        .stroke({ width: 2 });
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
    <AlignedPixiContainer x={x} y={y} nodeHeight={diameter}>
      <pixiContainer x={0} y={radius}>
        <pixiGraphics draw={drawPorts} />
      </pixiContainer>
      <pixiContainer x={radius} y={radius}>
        <pixiGraphics draw={drawNode} />
      </pixiContainer>
      {/*<pixiText
        text={text}
        x={radius}
        y={radius}
        anchor={0.5}
        style={{ fontSize: 19, fill: "white" }}
      />*/}
    </AlignedPixiContainer>
  );
}
