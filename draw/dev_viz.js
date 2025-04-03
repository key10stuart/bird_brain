// draw/dev_viz.js
import { mouse } from "../core/input.js";
import { canvas } from "../core/input.js";

export function drawDevViz(ctx) {
  const margin = 20;
  const x = canvas.width - margin - 20; // right side
  const y = margin + 20;                // slightly below top

  ctx.save();

  // Draw the mouse body
  ctx.beginPath();
  ctx.ellipse(x, y, 12, 8, 0, 0, Math.PI * 2); // body
  ctx.fillStyle = "#888";
  ctx.fill();

  // Tail
  ctx.beginPath();
  ctx.moveTo(x + 12, y + 3);
  ctx.quadraticCurveTo(x + 24, y + 8, x + 30, y + 15);
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Ears
  ctx.beginPath();
  ctx.arc(x - 7, y - 8, 4, 0, Math.PI * 2);
  ctx.arc(x + 7, y - 8, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#aaa";
  ctx.fill();

  // Nose
  ctx.beginPath();
  ctx.arc(x + 10, y, 1.8, 0, Math.PI * 2);
  ctx.fillStyle = "pink";
  ctx.fill();

  // Eyes
  ctx.beginPath();
  ctx.arc(x - 3, y - 2, 1.5, 0, Math.PI * 2);
  ctx.arc(x + 3, y - 2, 1.5, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();

  // Word bubble
  if (mouse.isDown) {
    ctx.beginPath();
    ctx.ellipse(x - 40, y - 20, 24, 14, 0, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "10px monospace";
    ctx.fillText("click", x - 52, y - 16);
  }

  ctx.restore();
}
