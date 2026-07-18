import type { FederatedPointerEvent, Graphics } from "pixi.js";
import type { Coord } from "@/components/graph/types";
import { useRef } from "react";

const gridStyle = {
  gridSize: 40,
  rows: 70,
  cols: 40,
  magRadius: 220,
  magDistance: 20,
};

export default function Grid() {
  const { gridSize, rows, cols, magRadius: radius, magDistance } = gridStyle;
  const gridRef = useRef<Graphics>(null);
  const gridCoordRef = useRef<Float32Array[]>([
    new Float32Array(cols),
    new Float32Array(cols),
  ]);

  const drawGrid = (graphics: Graphics, mouseCoord?: Coord) => {
    graphics.clear();
    const [prevRowXs, prevRowYs] = gridCoordRef.current;
    // use fixed-length array to improve performance
    for (let row = 0; row < rows; row++) {
      // record previous column point position
      let prevColX = 0;
      let prevColY = 0;
      for (let col = 0; col < cols; col++) {
        let x = row * gridSize;
        let y = col * gridSize;
        if (mouseCoord !== undefined) {
          const currCoord = { x, y };
          const dist = getDist(mouseCoord, currCoord);
          const vec = getVector(mouseCoord, currCoord, dist);
          if (dist <= radius) {
            const mapLength = ((radius - dist) / radius) * magDistance;
            x += vec.x * mapLength;
            y += vec.y * mapLength;
          }
        }
        if (row > 0) {
          graphics.moveTo(x, y).lineTo(prevRowXs[col], prevRowYs[col]);
        }
        if (col > 0) {
          graphics.moveTo(x, y).lineTo(prevColX, prevColY);
        }
        prevRowXs[col] = x;
        prevRowYs[col] = y;
        prevColX = x;
        prevColY = y;
      }
    }
    graphics.stroke({ width: 1, color: "lightgray", alpha: 0.7 });
  };

  const onMouseMove = (event: FederatedPointerEvent) => {
    if (!gridRef.current) return;
    const graphics = gridRef.current;
    const localPoint = graphics.toLocal(event.global);
    drawGrid(graphics, { x: localPoint.x, y: localPoint.y });
  };

  return (
    <pixiContainer>
      <pixiGraphics
        ref={gridRef}
        eventMode="static"
        draw={drawGrid}
        onGlobalPointerMove={onMouseMove}
      />
    </pixiContainer>
  );
}

const getVector = (from: Coord, to: Coord, dist: number) => {
  if (dist == 0) {
    return { x: 0, y: 0 };
  }
  const vector: Coord = {
    x: (to.x - from.x) / dist,
    y: (to.y - from.y) / dist,
  };
  return vector;
};

const getDist = (from: Coord, to: Coord) => {
  const dist = Math.sqrt((to.y - from.y) ** 2 + (to.x - from.x) ** 2);
  return dist;
};
