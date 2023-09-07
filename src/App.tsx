import Matter from "matter-js";

import Visualizer from "./Components/Visualizer";

function newtonsCradle(
  xx: number,
  yy: number,
  number: number,
  size: number,
  length: number
) {
  const Composite = Matter.Composite,
    Constraint = Matter.Constraint,
    Bodies = Matter.Bodies;

  const newtonsCradle = Composite.create({ label: "Newtons Cradle" });

  for (let i = 0; i < number; i++) {
    const separation = 1.9,
      circle = Bodies.circle(xx + i * (size * separation), yy + length, size, {
        inertia: Infinity,
        restitution: 1,
        friction: 0,
        frictionAir: 0,
        slop: size * 0.02,
      }),
      constraint = Constraint.create({
        pointA: { x: xx + i * (size * separation), y: yy },
        bodyB: circle,
      });

    Composite.add(newtonsCradle, circle);
    Composite.add(newtonsCradle, constraint);
  }

  return newtonsCradle;
}

export default function App() {
  return (
    <section className="canvas-main-container">
      <Visualizer
        addComponents={(world: Matter.Composite) => {
          const Bodies = Matter.Bodies;

          const boxA = Bodies.rectangle(150, 200, 80, 80);
          const boxB = Bodies.rectangle(100, 50, 80, 80);
          const ground = Bodies.rectangle(0, 280, 810, 40, { isStatic: true });

          // add all of the bodies to the world
          Matter.Composite.add(world, [boxA, boxB, ground]);
        }}
      />
      <Visualizer
        addComponents={(
          world: Matter.Composite,
          engine: Matter.Engine,
          renderer: Matter.Render
        ) => {
          const Common = Matter.Common;
          const Composite = Matter.Composite;
          const Bodies = Matter.Bodies;
          const Composites = Matter.Composites;
          const Mouse = Matter.Mouse;
          const MouseConstraint = Matter.MouseConstraint;

          Composite.add(world, [
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
          ]);

          engine.gravity.y = -1;

          const stack = Composites.stack(
            50,
            120,
            11,
            5,
            0,
            0,
            function (x: number, y: number) {
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
            }
          );

          Composite.add(world, stack);

          // add mouse control
          const mouse = Mouse.create(renderer.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
              mouse: mouse,
              constraint: {
                stiffness: 0.2,
                render: {
                  visible: false,
                },
              },
            });

          Composite.add(world, mouseConstraint);
        }}
      />
      <Visualizer
        addComponents={(
          world: Matter.Composite,
          engine: Matter.Engine,
          renderer: Matter.Render
        ) => {
          const Body = Matter.Body;
          const MouseConstraint = Matter.MouseConstraint;
          const Mouse = Matter.Mouse;
          const Composite = Matter.Composite;
          const Render = Matter.Render;

          let cradle = newtonsCradle(280, 100, 5, 30, 200);
          Composite.add(world, cradle);
          Body.translate(cradle.bodies[0], { x: -180, y: -100 });

          cradle = newtonsCradle(280, 380, 7, 20, 140);
          Composite.add(world, cradle);
          Body.translate(cradle.bodies[0], { x: -140, y: -100 });

          let mouse, mouseConstraint;
          // add mouse control
          (mouse = Mouse.create(renderer.canvas)),
            (mouseConstraint = MouseConstraint.create(engine, {
              mouse: mouse,
              constraint: {
                stiffness: 0.2,
                render: {
                  visible: false,
                },
              },
            }));

          Composite.add(world, mouseConstraint);

          // keep the mouse in sync with rendering
          renderer.mouse = mouse;

          // fit the render viewport to the scene
          Render.lookAt(renderer, {
            min: { x: 0, y: 50 },
            max: { x: 800, y: 600 },
          });
        }}
      />
    </section>
  );
}
