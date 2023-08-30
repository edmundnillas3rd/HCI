import { useEffect, useRef } from "react";
import Matter from "matter-js";

function newtonsCradle(xx, yy, number, size, length) {
  var Composite = Matter.Composite,
      Constraint = Matter.Constraint,
      Bodies = Matter.Bodies;

  var newtonsCradle = Composite.create({ label: 'Newtons Cradle' });

  for (var i = 0; i < number; i++) {
      var separation = 1.9,
          circle = Bodies.circle(xx + i * (size * separation), yy + length, size, 
              { inertia: Infinity, restitution: 1, friction: 0, frictionAir: 0, slop: size * 0.02 }),
          constraint = Constraint.create({ pointA: { x: xx + i * (size * separation), y: yy }, bodyB: circle });

      Composite.addBody(newtonsCradle, circle);
      Composite.addConstraint(newtonsCradle, constraint);
  }

  return newtonsCradle;
}

export default function App() {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);

  const anotherBoxRef = useRef(null);
  const anotherCanvasRef = useRef(null);

  const aaBoxRef = useRef(null);
  const aaCanvasRef = useRef(null);

  useEffect(() => {
    let Engine = Matter.Engine;
    let Render = Matter.Render;
    let Composite = Matter.Composite;
    let Composites = Matter.Composites;
    let Bodies = Matter.Bodies;
    let Body = Matter.Body;
    let Runner = Matter.Runner;
    let Common = Matter.Common;
    let MouseConstraint = Matter.MouseConstraint;
    let Mouse = Matter.Mouse;

    let engine = Engine.create({});

    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: 300,
        height: 300,
        background: "rgba(150, 5, 0, 0.5)",
        wireframes: false,
      },
    });

    // create two boxes and a ground
    var boxA = Bodies.rectangle(150, 200, 80, 80);
    var boxB = Bodies.rectangle(100, 50, 80, 80);
    var ground = Bodies.rectangle(0, 280, 810, 40, { isStatic: true });

    // add all of the bodies to the world
    Composite.add(engine.world, [boxA, boxB, ground]);

    // run the renderer
    Render.run(render);

    // create runner
    var runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);

    // Second Example
    let anotherEngine = Engine.create();
    let world = anotherEngine.world;

    let anotherRender = Render.create({
      element: anotherBoxRef.current,
      engine: anotherEngine,
      canvas: anotherCanvasRef.current,
      options: {
        width: 300,
        height: 300,
        showVelocity: true,
        showAngleIndicator: true,
      },
    });

    Composite.add(world, [
      Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true }),
      Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    ]);

    anotherEngine.gravity.y = -1;

    var stack = Composites.stack(50, 120, 11, 5, 0, 0, function (x, y) {
      switch (Math.round(Common.random(0, 1))) {
        case 0:
          if (Common.random() < 0.8) {
            return Bodies.rectangle(
              x,
              y,
              Common.random(20, 50),
              Common.random(20, 50)
            );
          } else {
            return Bodies.rectangle(
              x,
              y,
              Common.random(80, 120),
              Common.random(20, 30)
            );
          }
        case 1:
          return Bodies.polygon(
            x,
            y,
            Math.round(Common.random(1, 8)),
            Common.random(20, 50)
          );
      }
    });

    Composite.add(world, stack);

    // add mouse control
    var mouse = Mouse.create(anotherRender.canvas),
      mouseConstraint = MouseConstraint.create(anotherEngine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    anotherRender.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(anotherRender, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 },
    });

    Render.run(anotherRender);

    let anotherRunner = Runner.create();

    Runner.run(anotherRunner, anotherEngine);

    // Third Example
    let aaEngine = Engine.create();
    let aaWorld = aaEngine.world;

    let aaRender = Render.create({
      element: aaBoxRef.current,
      engine: aaEngine,
      canvas: aaCanvasRef.current,
      options: {
        width: 300,
        height: 300,
        showVelocity: true,
      },
    });

    var cradle = newtonsCradle(280, 100, 5, 30, 200);
    Composite.add(aaWorld, cradle);
    Body.translate(cradle.bodies[0], { x: -180, y: -100 });
    
    cradle = newtonsCradle(280, 380, 7, 20, 140);
    Composite.add(aaWorld, cradle);
    Body.translate(cradle.bodies[0], { x: -140, y: -100 });

    // add mouse control
    var mouse = Mouse.create(aaRender.canvas),
        mouseConstraint = MouseConstraint.create(aaEngine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(aaWorld, mouseConstraint);

    // keep the mouse in sync with rendering
    aaRender.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(aaRender, {
        min: { x: 0, y: 50 },
        max: { x: 800, y: 600 }
    });

    Render.run(aaRender);
    let aaRunner = Runner.create();
    Runner.run(aaRunner, aaEngine);
  }, []);

  return (
    <section className="canvas-main-container">
      <div className="canvas-container" ref={boxRef}>
        <canvas ref={canvasRef} />
      </div>
      <div className="canvas-container" ref={anotherBoxRef}>
        <canvas ref={anotherCanvasRef} />
      </div>
      <div className="canvas-container" ref={aaBoxRef}>
        <canvas ref={aaCanvasRef}/>
      </div>
    </section>
  );
}
