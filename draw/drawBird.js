// draw/drawBird.js

import { isDevMode, getDevBird } from "../core/dev_env.js";

// Main render entry point for birds
export function drawBird(ctx, bird) {
  ctx.save();

  ctx.translate(bird.x, bird.y);
  ctx.rotate(bird.angle);

  if (bird.state === "LANDED") {
    drawLandedBird(ctx, bird);
  } else {
    drawFlyingBird(ctx, bird);
  }

  ctx.restore();
}

export function drawFlyingBird(ctx, bird) {
  const altitudeShift = isDevMode() && bird === getDevBird() ? 1 : 0;
  const visualScale = 0.5 + bird.altitude + altitudeShift;

  ctx.scale(visualScale, visualScale);

  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = bird.color || "cyan";
  ctx.fill();

  if (bird.spriteMode === "DIVE") {
    drawWing(ctx, 0, -4, -10, -8);
    drawWing(ctx, 0, 4, -10, 8);
  } else {
    const gliding = bird.spriteMode === "GLIDE";
    const easedFlap = Math.sin(bird.flapAnim * Math.PI); // smoother lift cycle
    const fold = gliding ? 0 : 40 * easedFlap;
    drawWing(ctx, 0, -10, -20 + fold, -18);
    drawWing(ctx, 0, 10, -20 + fold, 18);
  }

  drawEyesAndBeak(ctx);
}

export function drawLandedBird(ctx, bird) {
  const altitudeShift = isDevMode() && bird === getDevBird() ? 1 : 0;
  const visualScale = 0.75 + altitudeShift;

  ctx.save();
  ctx.scale(visualScale, visualScale);

  // Body (vertically squashed)
  ctx.save();
  ctx.scale(1, 0.6);
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = bird.color || "cyan";
  ctx.fill();
  ctx.restore();

  drawWing(ctx, -4, -3, -8, -4);
  drawWing(ctx, -4, 3, -8, 4);
  drawEyesAndBeak(ctx, true);

  ctx.restore();
}

function drawWing(ctx, baseX, baseY, tipX, tipY) {
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(tipX, tipY);
  const offset = baseY < 0 ? 8 : -8;
  ctx.lineTo(baseX, baseY + offset);
  ctx.closePath();
  ctx.fillStyle = "cyan";
  ctx.fill();
}

function drawEyesAndBeak(ctx, isLanded = false) {
  const eyeSize = isLanded ? 1.8 : 2;
  const eyeX = isLanded ? 3 : 6;

  ctx.beginPath();
  ctx.ellipse(eyeX, -2, eyeSize, 1, 0, 0, Math.PI * 2);
  ctx.ellipse(eyeX, 2, eyeSize, 1, 0, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();

  const beakLength = isLanded ? 4 : 6;
  const beakBaseX = isLanded ? 5 : 10;
  const beakWidth = 4;

  ctx.beginPath();
  ctx.moveTo(beakBaseX, -beakWidth / 2);
  ctx.lineTo(beakBaseX + beakLength, 0);
  ctx.lineTo(beakBaseX, beakWidth / 2);
  ctx.closePath();
  ctx.fillStyle = "orange";
  ctx.fill();
}
