import { useGSAP } from "@gsap/react";
import { CanvasTextMetrics, Container, Graphics, TextStyle } from "pixi.js";
import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";

const title = "cinna";
const subTitle = "Your telegram daily assistant";
const subTitleStyle: TextStyle = new TextStyle({
  fontFamily: "Geist Pixel",
  fontSize: 30,
  letterSpacing: 2.0,
});

export default function Title({ x, y }: { x: number; y: number }) {
  const clipRef = useRef<Graphics>(null);
  const letterRefs = useRef<Container[]>([]);
  const subtitleRef = useRef<Container>(null);

  const letters = useMemo(() => Array.from(subTitle), []);
  const letterPositions = useMemo(
    () =>
      letters.map(
        (_, index) =>
          CanvasTextMetrics.measureText(subTitle.slice(0, index), subTitleStyle).width,
      ),
    [letters],
  );
  const subtitleWidth = CanvasTextMetrics.measureText(subTitle, subTitleStyle).width;

  useLayoutEffect(() => {
    if (!subtitleRef.current || !clipRef.current) return;
    subtitleRef.current.mask = clipRef.current;
  }, []);

  useGSAP(
    () => {
      gsap.set(letterRefs.current, {
        y: subTitleStyle.fontSize,
      });
      gsap.to(letterRefs.current, {
        y: 0,
        duration: 0.6,
        ease: "elastic.out(0.7)",
        stagger: 0.075,
      });
    },
    { scope: subtitleRef },
  );

  return (
    <pixiContainer x={x} y={y}>
      <pixiText
        text={title}
        x={0}
        y={0}
        anchor={{ x: 0.0, y: 1.0 }}
        style={{
          fontFamily: "Roboto Slab",
          fontWeight: "500",
          fontSize: 130,
          letterSpacing: 3.0,
        }}
      />
      <pixiGraphics
        ref={clipRef}
        draw={(graphics: Graphics) => {
          graphics.clear();
          graphics.rect(0, -10, subtitleWidth, 35).fill("white");
        }}
        renderable={true}
      />
      <pixiContainer ref={subtitleRef} x={0} y={-10}>
        {letters.map((letter, index) => (
          <pixiContainer
            key={`${letter}-${index}`}
            x={letterPositions[index]}
            ref={(container) => {
              if (container) letterRefs.current[index] = container;
            }}
          >
            <pixiText text={letter} style={subTitleStyle} />
          </pixiContainer>
        ))}
      </pixiContainer>
    </pixiContainer>
  );
}
