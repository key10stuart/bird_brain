// core/timeControl.js

import { settings } from "./settings.js";

let lastTime = performance.now();
let delta = 16;
let scaledDelta = 16;

export function updateTime() {
  const now = performance.now();
  delta = now - lastTime;
  lastTime = now;

  scaledDelta = delta * (settings.simSpeed || 1);
}

export function getDelta() {
  return delta;
}

export function getScaledDelta() {
  return scaledDelta;
}

export function resetTime() {
  lastTime = performance.now();
}
