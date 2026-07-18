import { useCallback, useMemo } from "react";
import { GraphicsPath, type Graphics } from "pixi.js";
import type { Coord } from "@/components/graph/types";
import { COLOR_SCHEME, getBezierPoints } from "@/components/graph/shared";

type EdgeProps = {
  start: Coord;
  end: Coord;
};

export default function Edge({ start, end }: EdgeProps) {
  const path = useMemo(() => createEdgePath(start, end), [start, end]);
  const draw = useCallback(
    (graphics: Graphics) => {
      graphics
        .clear()
        .path(path)
        .stroke({ color: COLOR_SCHEME.edge, width: 4, alpha: 0.3 });
    },
    [path],
  );
  return <pixiGraphics draw={draw} />;
}

function createEdgePath(start: Coord, end: Coord): GraphicsPath {
  const path = new GraphicsPath();
  const { bStart, c1, c2, bEnd } = getBezierPoints(start, end);
  path.moveTo(bStart.x, bStart.y);
  path.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, bEnd.x, bEnd.y);
  return path;
}
