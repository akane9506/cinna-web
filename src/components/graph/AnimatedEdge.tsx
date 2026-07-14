import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCallback, useRef } from "react";
import { type Graphics, GraphicsPath } from "pixi.js";
import type { Coord, BezierPoints } from "@/components/graph/types";
import { COLOR_SCHEME, getBezierPoints } from "@/components/graph/shared";

type AnimatedEdgeProps = {
  start: Coord;
  end: Coord;
  depth: number;
};

export default function AnimatedEdge({ start, end, depth }: AnimatedEdgeProps) {
  const graphicRef = useRef<Graphics>(null);
  const draw = useCallback((graphics: Graphics) => {
    if (!graphicRef.current) {
      graphicRef.current = graphics;
    }
  }, []);

  useGSAP(
    () => {
      const graphics = graphicRef.current;
      if (!graphics) return;
      const state = {
        progress: 0,
      };
      const render = () => {
        drawEdge(graphics, start, end, state.progress);
      };
      render();
      gsap.to(state, {
        delay: depth * 0.5,
        progress: 1,
        duration: 0.5,
        ease: "power3.inOut",
        onUpdate: render,
        onComplete: () => {
          state.progress = 1;
          render();
        },
      });
    },
    { dependencies: [start, end], revertOnUpdate: true },
  );

  return <pixiGraphics draw={draw} />;
}

// Draw Pixi Edge
function drawEdge(graphics: Graphics, start: Coord, end: Coord, progress: number) {
  const path = createAnimatedEdgePath(start, end, progress);
  graphics.clear().path(path).stroke({
    color: COLOR_SCHEME.activeEdge,
    cap: "round",
    width: 5,
  });
}

// Create the in-progress sub-Bezier curve, progress = [0.0, 1.0]
function createAnimatedEdgePath(
  start: Coord,
  end: Coord,
  progress: number,
): GraphicsPath {
  const path = new GraphicsPath();
  const clampedProgress = Math.min(1, Math.max(0, progress));

  const { bStart, c1, c2, bEnd } = getBezierPoints(start, end);
  const {
    bStart: cbStart,
    c1: cc1,
    c2: cc2,
    bEnd: cbEnd,
  } = splitCubicBezier(bStart, c1, c2, bEnd, clampedProgress);
  path.moveTo(cbStart.x, cbStart.y);
  if (clampedProgress > 0) {
    path.bezierCurveTo(cc1.x, cc1.y, cc2.x, cc2.y, cbEnd.x, cbEnd.y);
  }
  return path;
}

// De Casteljau subdivision to split a cubic Bezier curve at t
function splitCubicBezier(
  p0: Coord,
  p1: Coord,
  p2: Coord,
  p3: Coord,
  t: number,
): BezierPoints {
  const p01 = lerpPoints(p0, p1, t);
  const p12 = lerpPoints(p1, p2, t);
  const p23 = lerpPoints(p2, p3, t);

  const p012 = lerpPoints(p01, p12, t);
  const p123 = lerpPoints(p12, p23, t);

  const p0123 = lerpPoints(p012, p123, t);
  return { bStart: p0, c1: p01, c2: p012, bEnd: p0123 };
}

// find the in-between coord based on the parameter t = [0.0, 1.0]
function lerpPoints(a: Coord, b: Coord, t: number): Coord {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}
