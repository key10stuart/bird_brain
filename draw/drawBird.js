// draw/drawBird.js
import { mouse } from "../core/input.js";

export function drawFlyingBird(ctx, bird) {
  ctx.scale(bird.altitude, bird.altitude);
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = "cyan";
  ctx.fill();

  if (bird.spriteMode === "DIVE") {
    drawWing(ctx, 0, -4, -10, -8);
    drawWing(ctx, 0, 4, -10, 8);
  } else {
    const gliding = mouse.isDown && bird.mouseDownTime >= 10;
    const easedFlap = Math.pow(bird.flapAnim, 0.5);
    const fold = gliding ? 0 : 40 * easedFlap; // larger wing spread
    drawWing(ctx, 0, -10, -20 + fold, -18);
    drawWing(ctx, 0, 10, -20 + fold, 18);
  }

  drawHead(ctx);
}

export function drawLandedBird(ctx) {
  ctx.scale(0.4, 0.6);
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = "cyan";
  ctx.fill();

  drawWing(ctx, 0, -6, 8, -14);
  drawWing(ctx, 0, 6, 8, 14);
  drawHead(ctx);
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

function drawHead(ctx) {
  ctx.beginPath();
  ctx.moveTo(12, 0);
  ctx.lineTo(8, -3);
  ctx.lineTo(8, 3);
  ctx.closePath();
  ctx.fillStyle = "orange";
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(6, -2, 2, 1, 0, 0, Math.PI * 2);
  ctx.ellipse(6, 2, 2, 1, 0, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
}
