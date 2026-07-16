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
      <div ref={backgroundRef} className="fixed inset-0 -z-10">
        <Application
          className="w-full h-full"
          preference="webgpu"
          resizeTo={window}
          background={0xf1f0ed}
        >
          <Grid />
        </Application>
      </div>
      {/*application body*/}
      <div ref={canvasRef} className="w-full max-w-[1700px] h-full">
        <Application
          preference="webgpu"
          resizeTo={canvasRef}
          backgroundAlpha={0}
          autoDensity
          antialias
          resolution={window.devicePixelRatio}
        >
          <CanvasContainer />
        </Application>
      </div>
    </>
  );
}
