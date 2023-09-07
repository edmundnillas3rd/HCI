import Matter from "matter-js";
import { useEffect, useRef } from "react";

export default function Visualizer({
  addComponents,
}: VisualizerProps): JSX.Element {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const Runner = Matter.Runner;

    const engine = Engine.create();
    const world = engine.world;

    const render = Render.create({
      element: boxRef.current as unknown as HTMLElement,
      engine: engine,
      canvas: canvasRef.current as unknown as HTMLCanvasElement,
      options: {
        width: 300,
        height: 300,
        background: "rgba(150, 5, 0, 0.5)",
      },
    });

    addComponents(world, engine, render);

    Render.run(render);

    const runner = Runner.create();

    Runner.run(runner, engine);
  }, []);

  return (
    <div className="canvas-container" ref={boxRef}>
      <canvas ref={canvasRef} />
    </div>
  );
}
