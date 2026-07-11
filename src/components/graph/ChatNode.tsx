import { useCallback, useRef } from "react";
import gsap from "gsap";
import { DEG_TO_RAD, Graphics, type Container } from "pixi.js";
import { useGSAP } from "@gsap/react";
import { PORT_SIZE } from "@/components/graph/shared";
import type { NodeProps, NodeStyle } from "@/components/graph/types";
import AlignedPixiContainer from "@/components/graph/AlignedPixiContainer";

const nodeStyle: NodeStyle = {
  width: 140,
  height: 110,
  radius: 12,
  text: "Chat Model",
};

const mcpStyle = {
  width: 80,
  height: 70,
  extend: 30,
  radius: 12,
  x: 70,
  y: -28,
  rotation: 10 * DEG_TO_RAD,
  hoverX: 110,
  hoverY: -25,
  text: "MCP",
  hoverRotation: -26 * DEG_TO_RAD,
};

const toolsStyle = {
  width: 100,
  halfHeight: 24,
  extend: 16,
  radius: 12,
  x: 30,
  y: 120,
  rotation: -220 * DEG_TO_RAD,
  text: "Tools",
  hoverRotation: -20 * DEG_TO_RAD,
};

export default function ChatNode({ x, y }: NodeProps) {
  const { width, height, radius, text } = nodeStyle;

  const mcpRef = useRef<Graphics>(null);
  const toolsRef = useRef<Graphics>(null);
  const containerRef = useRef<Container>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleHoverIn = () => {
    contextSafe(() => {
      if (!mcpRef.current) return;
      gsap.to(mcpRef.current, {
        x: mcpStyle.hoverX,
        y: mcpStyle.hoverY,
        rotation: mcpStyle.hoverRotation,
        duration: 0.5,
        ease: "elastic.out",
      });
      gsap.to(toolsRef.current, {
        rotation: toolsStyle.hoverRotation,
        duration: 0.5,
        ease: "elastic.out",
      });
    })();
  };

  const handleHoverOut = () => {
    contextSafe(() => {
      if (!mcpRef.current) return;
      gsap.to(mcpRef.current, {
        x: mcpStyle.x,
        y: mcpStyle.y,
        rotation: mcpStyle.rotation,
        duration: 0.5,
        ease: "elastic.out",
      });
      gsap.to(toolsRef.current, {
        rotation: toolsStyle.rotation,
        duration: 0.5,
        ease: "elastic.out",
      });
    })();
  };

  // draw node body
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
  // draw node ports
  const drawPorts = useCallback(
    (graphics: Graphics) => {
      graphics.clear();
      graphics.circle(0, 0, PORT_SIZE).fill("white");
      graphics.circle(width, 0, PORT_SIZE).fill("white");
    },
    [width],
  );
  // draw mcp tag
  const drawMCP = useCallback((graphics: Graphics) => {
    graphics.clear();
    graphics
      .roundShape(
        [
          { x: 0, y: 0 },
          { x: mcpStyle.width, y: 0 },
          { x: mcpStyle.width + mcpStyle.extend, y: mcpStyle.height / 2, radius: 10 },
          { x: mcpStyle.width, y: mcpStyle.height },
          { x: 0, y: mcpStyle.height },
        ],
        mcpStyle.radius,
      )
      .fill({ color: "coral" })
      .stroke({ width: 2 });
  }, []);
  // draw tool tag
  const drawTools = useCallback((graphics: Graphics) => {
    graphics.clear();
    graphics
      .roundShape(
        [
          { x: -toolsStyle.width, y: -toolsStyle.halfHeight },
          { x: 0, y: -toolsStyle.halfHeight },
          { x: toolsStyle.extend, y: 0 },
          { x: 0, y: toolsStyle.halfHeight },
          { x: -toolsStyle.width, y: toolsStyle.halfHeight },
        ],
        toolsStyle.radius,
      )
      .fill({ color: "coral" })
      .stroke({ width: 2 });
  }, []);

  return (
    <AlignedPixiContainer ref={containerRef} x={x} y={y} nodeHeight={nodeStyle.height}>
      {/* MCP tag */}
      <pixiContainer
        x={mcpStyle.x}
        y={mcpStyle.y}
        rotation={mcpStyle.rotation}
        ref={mcpRef}
      >
        <pixiGraphics draw={drawMCP} />
        <pixiText
          text={mcpStyle.text}
          x={(mcpStyle.width + mcpStyle.extend) / 2}
          y={mcpStyle.height / 2}
          anchor={0.5}
          style={{
            fontSize: 19,
            fill: "white",
          }}
        />
      </pixiContainer>
      {/* Tools tags */}
      <pixiContainer
        x={toolsStyle.x}
        y={toolsStyle.y}
        rotation={toolsStyle.rotation}
        ref={toolsRef}
      >
        <pixiGraphics draw={drawTools} />
        <pixiText
          text={toolsStyle.text}
          x={-toolsStyle.width / 2}
          y={0}
          anchor={0.5}
          style={{
            fontSize: 19,
            fill: "white",
          }}
        />
      </pixiContainer>
      {/* Ports */}
      <pixiContainer x={0} y={height / 2}>
        <pixiGraphics draw={drawPorts} />
      </pixiContainer>
      {/* Chat Node body */}
      <pixiContainer
        eventMode="static"
        cursor="pointer"
        onPointerOver={handleHoverIn}
        onPointerOut={handleHoverOut}
      >
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
      </pixiContainer>
    </AlignedPixiContainer>
  );
}
