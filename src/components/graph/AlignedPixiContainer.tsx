import type { PixiReactElementProps } from "@pixi/react";
import { yAlign } from "./shared";
import type { Container } from "pixi.js";

// this is the wrapper component to center pixiContainer vertically
type AlignedPixiContainerProps = {
  nodeHeight: number;
  label?: string;
} & PixiReactElementProps<typeof Container>;

export default function AlignedPixiContainer(props: AlignedPixiContainerProps) {
  const { x, y, nodeHeight, children, ...restProps } = props;
  return (
    <pixiContainer
      x={x}
      y={yAlign(y, nodeHeight)}
      cursor="pointer"
      eventMode="static"
      {...restProps}
    >
      {children}
    </pixiContainer>
  );
}
