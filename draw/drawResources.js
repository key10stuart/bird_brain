import { resources } from "../entities/Resources.js";

export function drawResources(ctx) {
  for (const r of resources) {
    ctx.save();
    ctx.translate(r.x, r.y);

    switch (r.type) {
      case "BERRY":
        drawCherries(ctx);
        break;
      case "BUG":
        drawDragonfly(ctx);
        break;
      case "SEED":
        drawAcorn(ctx);
        break;
    }

    ctx.restore();
  }
}

// 🍒 Cherries
function drawCherries(ctx) {
  ctx.fillStyle = "red";
  // Two circles
  ctx.beginPath();
  ctx.arc(-3, 0, 3, 0, Math.PI * 2);
  ctx.arc(3, 0, 3, 0, Math.PI * 2);
  ctx.fill();
  // Stems
  ctx.strokeStyle = "green";
  ctx.beginPath();
  ctx.moveTo(-3, -2);
  ctx.lineTo(0, -6);
  ctx.lineTo(3, -2);
  ctx.stroke();
}

// dragonfly
function drawDragonfly(ctx) {
    // Wings (transparent bluish)
    ctx.fillStyle = "rgba(173, 216, 230, 0.6)";
    ctx.beginPath();
    ctx.ellipse(-4, -2.5, 5, 1.2, Math.PI / 6, 0, Math.PI * 2);
    ctx.ellipse(4, -2.5, 5, 1.2, -Math.PI / 6, 0, Math.PI * 2);
    ctx.ellipse(-4, 2.5, 5, 1.2, -Math.PI / 6, 0, Math.PI * 2);
    ctx.ellipse(4, 2.5, 5, 1.2, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
  
    // Body (bright green!)
    ctx.fillStyle = "#32CD32"; // lime green
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(0, i * 1.5 - 3, 1, 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  
    // Head
    ctx.beginPath();
    ctx.arc(0, -5, 2, 0, Math.PI * 2);
    ctx.fill();
  
    // Eyes
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(-0.8, -5.3, 0.5, 0, Math.PI * 2);
    ctx.arc(0.8, -5.3, 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  
  
  
// 🌰 Acorn
function drawAcorn(ctx) {
    // Nut (bottom part)
    ctx.fillStyle = "#8B4513"; // dark brown
    ctx.beginPath();
    ctx.moveTo(-4, 2);
    ctx.quadraticCurveTo(0, 10, 4, 2); // rounded base
    ctx.lineTo(4, -1);
    ctx.quadraticCurveTo(0, 2, -4, -1);
    ctx.closePath();
    ctx.fill();
  
    // Cap (top part, overlapping)
    ctx.fillStyle = "#A0522D"; // lighter brown
    ctx.beginPath();
    ctx.ellipse(0, -1, 5, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
  
    // Stem
    ctx.strokeStyle = "#5A3A1E";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(0, -6);
    ctx.stroke();
  }
  
  
