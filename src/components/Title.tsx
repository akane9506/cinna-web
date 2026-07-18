import { useGSAP } from "@gsap/react";
import { CanvasTextMetrics, Container, Graphics, TextStyle } from "pixi.js";
import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { COLOR_SCHEME } from "./graph/shared";

const title = "cinna";
const titleStyle: TextStyle = new TextStyle({
  fontFamily: "Roboto Slab",
  fontWeight: "500",
  fontSize: 130,
  letterSpacing: 3.0,
  fill: COLOR_SCHEME.title,
});
const FLIP_INDICES = [1, 4];

const subTitle = "Your telegram daily assistant";
const subTitleStyle: TextStyle = new TextStyle({
  fontFamily: "Geist Pixel",
  fontSize: 30,
  letterSpacing: 1.6,
  fill: COLOR_SCHEME.subtitle,
});

export default function Title({ x, y }: { x: number; y: number }) {
  const clipRef = useRef<Graphics>(null);
  const titleRef = useRef<Container>(null);
  const titleLetterRefs = useRef<Container[]>([]);
  const subtitleLetterRefs = useRef<Container[]>([]);
  const subtitleRef = useRef<Container>(null);
  const { contextSafe } = useGSAP();

  // Handle title animations
  const titleLetters = useMemo(() => Array.from(title), []);
  const titleLetterPositions = useMemo(
    () =>
      titleLetters.map(
        (_, index) =>
          CanvasTextMetrics.measureText(title.slice(0, index), titleStyle).width,
      ),
    [titleLetters],
  );
  const titleMetrics = CanvasTextMetrics.measureText(title, titleStyle);
  const titleHeight = titleMetrics.height;

  // Handle subtitle animations
  const subtitleLetters = useMemo(() => Array.from(subTitle), []);
  const subtitleLetterPositions = useMemo(
    () =>
      subtitleLetters.map(
        (_, index) =>
          CanvasTextMetrics.measureText(subTitle.slice(0, index), subTitleStyle).width,
      ),
    [subtitleLetters],
  );
  const subtitleMetrics = CanvasTextMetrics.measureText(subTitle, subTitleStyle);
  const subtitleWidth = subtitleMetrics.width;
  const subtitleHeight = subtitleMetrics.lineHeight;

  useLayoutEffect(() => {
    if (!subtitleRef.current || !clipRef.current) return;
    subtitleRef.current.mask = clipRef.current;
  }, []);

  const handleSubtitleAnimation = () => {
    if (!subtitleLetterRefs.current) return;
    // maybe we could kill the tween somewhere here
    contextSafe(() => {
      gsap.killTweensOf(subtitleLetterRefs.current, "y");
      gsap.set(subtitleLetterRefs.current, {
        y: subTitleStyle.fontSize,
      });
      gsap.to(subtitleLetterRefs.current, {
        y: 0,
        duration: 0.6,
        ease: "elastic.out(0.7)",
        stagger: 0.075,
      });
    })();
  };

  const handleLetterFlip = (
    timeline: gsap.core.Timeline,
    index: number,
    order: number,
  ) => {
    const letter = titleLetterRefs.current[index];
    if (!letter) return;
    const bounds = letter.getLocalBounds();
    // control the animation start time of each letter
    const start = order * 0.5;
    // scale around the visual bottom-center of the character.
    letter.origin.set(bounds.x + bounds.width / 2, bounds.y + bounds.height);
    timeline
      .set(letter.scale, { x: 1 }, start)
      .to(
        letter.scale,
        {
          x: -1,
          duration: 0.5,
          ease: "power1.in",
        },
        start + 0.5,
      )
      .to(
        letter.scale,
        {
          x: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        start + 1.0,
      );
  };

  // title animation
  useGSAP(
    () => {
      const flipTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
      FLIP_INDICES.forEach((index, order) => {
        handleLetterFlip(flipTimeline, index, order);
      });
      return () => flipTimeline.kill();
    },
    { scope: titleRef },
  );

  // subtitle animation
  useGSAP(handleSubtitleAnimation, { scope: subtitleRef });

  return (
    <pixiContainer x={x} y={y}>
      <pixiContainer ref={titleRef} x={0} y={0}>
        {titleLetters.map((letter, index) => (
          <pixiContainer
            key={`title-${letter}-${index}`}
            ref={(container) => {
              if (container) titleLetterRefs.current[index] = container;
            }}
            x={titleLetterPositions[index]}
          >
            <pixiText text={letter} style={titleStyle} />
          </pixiContainer>
        ))}
      </pixiContainer>
      {/* subtitle mask */}
      <pixiGraphics
        ref={clipRef}
        draw={(graphics: Graphics) => {
          graphics.clear();
          graphics
            .rect(0, titleHeight - 10, subtitleWidth, subtitleHeight + 2)
            .fill("white");
        }}
        renderable={true}
      />
      <pixiContainer
        ref={subtitleRef}
        x={0}
        y={titleHeight - 10}
        cursor="pointer"
        eventMode="static"
        onPointerUp={handleSubtitleAnimation}
      >
        {subtitleLetters.map((letter, index) => (
          <pixiContainer
            key={`subtitle-${letter}-${index}`}
            x={subtitleLetterPositions[index]}
            ref={(container) => {
              if (container) subtitleLetterRefs.current[index] = container;
            }}
          >
            <pixiText text={letter} style={subTitleStyle} />
          </pixiContainer>
        ))}
      </pixiContainer>
    </pixiContainer>
  );
}
