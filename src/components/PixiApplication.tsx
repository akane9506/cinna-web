import { useRef } from "react";
import { Application } from "@pixi/react";
import CanvasContainer from "@/components/CanvasContainer";
import Grid from "@/components/Grid";

export default function PixiApplication() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/*background grid*/}
      <div ref={backgroundRef} className="absolute top-0 left-0 w-dvw h-dvh -z-10">
        <Application
          preference="webgpu"
          resizeTo={backgroundRef}
          background={0xf1f0ed}
          antialias
          autoDensity
          resolution={window.devicePixelRatio}
        >
          <Grid />
        </Application>
      </div>
      {/*application body*/}
      <div ref={canvasRef} className="w-[1700px] h-full">
        <Application
          preference="webgpu"
          resizeTo={canvasRef}
          backgroundAlpha={0}
          antialias
          autoDensity
          resolution={window.devicePixelRatio}
        >
          <CanvasContainer />
        </Application>
      </div>
    </>
  );
}
