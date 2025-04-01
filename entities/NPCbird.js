// entities/NPCBird.js

import { settings } from "../core/settings.js";
import { canvas } from "../core/input.js";

export class NPCBird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alt = 0;
    this.vx = 0;
    this.vy = 0;
    this.radius = 10;
    this.flapAnim = 0;
    this.energy = 0;

    this.brain = createRandomNN();
  }

  think(input) {
    const out = forward(this.brain, input);
    return {
      dx: out[0] * 2 - 1,
      dy: out[1] * 2 - 1,
      flap: out[2] > 0.5
    };
  }

  update(target = null) {
    let input;

    if (target) {
      const dx = (target.x - this.x) / canvas.width;
      const dy = (target.y - this.y) / canvas.height;
      input = [dx, dy, 1];
    } else {
      input = [Math.random(), Math.random(), 0];
    }

    const decision = this.think(input);

    this.vx += decision.dx * 0.05;
    this.vy += decision.dy * 0.05;

    if (decision.flap && this.alt <= 0) {
      this.vy -= settings.flapStrengthGround;
      this.flapAnim = 1;
    }

    this.vy += settings.gravity;

    this.x += this.vx;
    this.y += this.vy;

    // Clamp to canvas boundaries
    this.x = Math.max(0, Math.min(this.x, canvas.width));
    this.y = Math.max(0, Math.min(this.y, canvas.height));

    // Bounce inward on edge
    if (this.x <= 0 || this.x >= canvas.width) this.vx *= -0.5;
    if (this.y <= 0 || this.y >= canvas.height) this.vy *= -0.5;

    this.alt = Math.max(0, this.alt + this.vy);
    this.flapAnim *= 0.9;

    // Dampen velocity
    this.vx *= 0.95;
    this.vy *= 0.95;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(1, 1 - this.alt * 0.001);

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 7, 0, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.fill();

    // Wings
    const fold = this.flapAnim;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-20 * fold, -10);
    ctx.lineTo(-20 * fold, 10);
    ctx.fillStyle = 'blue';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(20 * fold, -10);
    ctx.lineTo(20 * fold, 10);
    ctx.fill();

    ctx.restore();
  }
}

// 🧠 Tiny 3-input, 4-hidden, 3-output neural net

function createRandomNN() {
  return {
    w1: [randWeights(3), randWeights(3), randWeights(3), randWeights(3)],
    b1: [0, 0, 0, 0],
    w2: [randWeights(4), randWeights(4), randWeights(4)],
    b2: [0, 0, 0]
  };
}

function randWeights(n) {
  return Array.from({ length: n }, () => Math.random() * 2 - 1);
}

function forward(nn, input) {
  const hidden = nn.w1.map((row, i) =>
    relu(dot(row, input) + nn.b1[i])
  );

  return nn.w2.map((row, i) =>
    sigmoid(dot(row, hidden) + nn.b2[i])
  );
}

function dot(a, b) {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

function relu(x) {
  return Math.max(0, x);
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}
