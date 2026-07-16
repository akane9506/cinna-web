type NodeNameProps = {
  nodeWidth: number;
  text: string;
  yShift?: number;
  rotation?: number;
};

export default function NodeName({
  nodeWidth,
  text,
  yShift = 0,
  rotation = 0,
}: NodeNameProps) {
  return (
    <pixiText
      text={text}
      x={nodeWidth / 2}
      y={yShift}
      anchor={0.5}
      style={{
        fontFamily: "Geist Pixel",
        fontSize: 18,
        fill: "white",
      }}
      rotation={rotation}
    />
  );
}
