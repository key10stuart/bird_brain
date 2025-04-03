import { canvas, ctx } from "./input.js";
import { PlayerBird } from "../entities/PlayerBird.js";
import { drawBird } from "../draw/drawBird.js";
import { drawDevViz } from "../draw/dev_viz.js";

// ✅ Correct imports from ui/ (fixes the MIME errors)
import { createSimPanel, destroySimPanel } from "../ui/sim_stuff.js";
import { createNeuralPanel, destroyNeuralPanel } from "../ui/neural_net_stuff.js";
import { createPhysicsPanel, destroyPhysicsPanel } from "../ui/physics_stuff.js";

let devBird = null;
let devMode = false;
let exitCallback = null;

export function isDevMode() {
  return devMode;
}

export function getDevBird() {
  return devBird;
}

export function startDevEnv() {
  devMode = true;

  devBird = new PlayerBird();
  devBird.birdBody.x = canvas.width / 2;
  devBird.birdBody.y = canvas.height / 2;  
  devBird.birdBody.altitude = 1;
  devBird.state = "FLYING";
}

export function stopDevEnv() {
  devMode = false;
  devBird = null;

  if (exitCallback) exitCallback();
}

export function toggleDevEnv() {
  if (devMode) {
    stopDevEnv();
  } else {
    startDevEnv();
  }
}

export function onDevExit(callback) {
  exitCallback = callback;
}

export function renderDevScene(ctx, bird) {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  bird.update();
  drawBird(ctx, bird.birdBody);

  if (isDevMode() && bird === getDevBird()) {
    drawDevOverlays(ctx, bird.birdBody); // ← ready to extend
  }

  drawDevViz(ctx);
}

function drawDevOverlays(ctx, bird) {
  // future debug lines / UI overlays can go here
  // e.g., attention lines, bounding circles, force vectors, etc.
  // currently blank
}
