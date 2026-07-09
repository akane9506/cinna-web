import { useCallback, useMemo } from "react";
import { GraphicsPath, type Graphics } from "pixi.js";
import type { Coord } from "@/components/graph/types";

type EdgeProps = {
  start: Coord;
  end: Coord;
};

export default function Edge({ start, end }: EdgeProps) {
  const path = useMemo(() => createEdgePath(start, end), [start, end]);
  const draw = useCallback(
    (graphics: Graphics) => {
      graphics.clear().path(path).stroke({ color: "teal", width: 4 });
    },
    [path],
  );
  return <pixiGraphics draw={draw} />;
}

function createEdgePath(start: Coord, end: Coord, offset: number = 160): GraphicsPath {
  const path = new GraphicsPath();
  path.moveTo(start.x, start.y);
  path.bezierCurveTo(start.x + offset, start.y, end.x - offset, end.y, end.x, end.y);
  return path;
}
