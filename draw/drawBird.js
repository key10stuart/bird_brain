// draw/drawBird.js
import { mouse } from "../core/input.js";

export function drawFlyingBird(ctx, bird) {
  // Alias altitude range [0, 2] as [1, 3] for visual scaling
  const visualScale = 0.5 + bird.altitude;
  ctx.scale(visualScale, visualScale);
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = "cyan";
  ctx.fill();

  if (bird.spriteMode === "DIVE") {
    drawWing(ctx, 0, -4, -10, -8);
    drawWing(ctx, 0, 4, -10, 8);
  } else {
    const gliding = bird.spriteMode === "GLIDE";
    const easedFlap = Math.pow(bird.flapAnim, 0.5);
    const fold = gliding ? 0 : 40 * easedFlap;
    drawWing(ctx, 0, -10, -20 + fold, -18);
    drawWing(ctx, 0, 10, -20 + fold, 18);
  }

  drawEyesAndBeak(ctx);
}

export function drawLandedBird(ctx) {
  ctx.save();
  ctx.scale(0.75, 0.45); // Slightly wider and fatter body
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = "cyan";
  ctx.fill();
  ctx.restore();

  // Slightly larger, folded wings
  drawWing(ctx, -4, -3, -8, -4);
  drawWing(ctx, -4, 3, -8, 4);

  drawEyesAndBeak(ctx, true);
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
  // Eyes
  const eyeSize = isLanded ? 1.8 : 2;
  const eyeX = isLanded ? 3 : 6; // Nudged further back
  ctx.beginPath();
  ctx.ellipse(eyeX, -2, eyeSize, 1, 0, 0, Math.PI * 2);
  ctx.ellipse(eyeX, 2, eyeSize, 1, 0, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();

  // Beak
  const beakLength = isLanded ? 4 : 6;
  const beakBaseX = isLanded ? 5 : 10; // A little further back
  const beakWidth = 4;

  ctx.beginPath();
  ctx.moveTo(beakBaseX, -beakWidth / 2);
  ctx.lineTo(beakBaseX + beakLength, 0);
  ctx.lineTo(beakBaseX, beakWidth / 2);
  ctx.closePath();
  ctx.fillStyle = "orange";
  ctx.fill();
}
