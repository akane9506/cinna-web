import { Graphics, GraphicsPath, Point } from "pixi.js";
import { useCallback, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type AnimatedEdgeProps = {
  start: Point;
  end: Point;
};

type Coord = {
  x: number;
  y: number;
};

type BezierPoints = {
  bStart: Coord;
  c1: Coord;
  c2: Coord;
  bEnd: Coord;
};

export default function AnimatedEdge({ start, end }: AnimatedEdgeProps) {
  const graphicRef = useRef<Graphics>(null);
  const draw = useCallback((graphics: Graphics) => {
    graphicRef.current = graphics;
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
        progress: 1,
        duration: 2,
        ease: "power2.out",
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

function drawEdge(graphics: Graphics, start: Point, end: Point, progress: number) {
  const path = createAnimatedEdgePath(start, end, progress);
  graphics.clear().path(path).stroke({
    color: "coral",
    width: 5,
  });
}

function createAnimatedEdgePath(
  start: Point,
  end: Point,
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

function getBezierPoints(start: Point, end: Point): BezierPoints {
  const distance = Math.abs(end.x - start.x);
  const offset = Math.max(40, distance * 0.8);
  const p0: Coord = { x: start.x, y: start.y };
  const p1: Coord = { x: start.x + offset, y: start.y };
  const p2: Coord = { x: end.x - offset, y: end.y };
  const p3: Coord = { x: end.x, y: end.y };
  return { bStart: p0, c1: p1, c2: p2, bEnd: p3 };
}

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

function lerpPoints(a: Coord, b: Coord, t: number): Coord {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}
