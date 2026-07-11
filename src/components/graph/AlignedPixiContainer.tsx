import type { PixiReactElementProps } from "@pixi/react";
import { yAlign } from "./shared";

// this is the wrapper component to center pixiContainer vertically
type AlignedPixiContainerProps = {
  nodeHeight: number;
} & PixiReactElementProps;

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
