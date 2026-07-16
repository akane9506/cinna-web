export default function Title({ x, y }: { x: number; y: number }) {
  return (
    <pixiContainer x={x} y={y}>
      <pixiText
        text={"cinna"}
        x={0}
        y={0}
        anchor={{ x: 0.0, y: 1.0 }}
        style={{ fontFamily: "Roboto Slab", fontSize: 130 }}
      />
      <pixiText
        text={"Your telegram daily assistant"}
        x={0}
        y={-10}
        style={{ fontFamily: "Geist Pixel", fontSize: 30 }}
      />
    </pixiContainer>
  );
}
