import { settings } from "../core/settings.js";
import { canvas } from "../core/input.js";
import { drawFlyingBird, drawLandedBird } from "../draw/drawBird.js";
import { getNearestResource } from "../entities/Resources.js";
import { forward, createRandomNN } from "../agents/brains.js";

export class NPCBird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;

    this.altitude = 0.5;
    this.flapAnim = 0;
    this.spriteMode = "FLY";
    this.state = "LANDED";

    this.radius = 10;
    this.bodyHeight = 7;

    this.energy = 0;
    this.brain = createRandomNN();
  }

  think() {
    const resource = getNearestResource(this.x, this.y);
    const rx = resource ? resource.x / canvas.width : 0.5;
    const ry = resource ? resource.y / canvas.height : 0.5;

    const input = [
      this.x / canvas.width,
      this.y / canvas.height,
      1, // bias
      rx,
      ry
    ];

    const output = forward(this.brain, input);

    const dx = (output[0] - 0.5) * 2;
    const dy = (output[1] - 0.5) * 2;
    const flap = output[2] > 0.9;

    return { dx, dy, flap };
  }

  update() {
    const decision = this.think();
    const margin = 10;
    const spriteHalfHeight = this.bodyHeight + 5;

    if (this.state === "LANDED") {
      this.altitude = 0.5;

      if (Math.abs(decision.dx) > 0.1 || Math.abs(decision.dy) > 0.1) {
        this.vx = decision.dx * settings.followSpeed;
        this.vy = decision.dy * settings.followSpeed;
      } else {
        this.vx = 0;
        this.vy = 0;
      }

      if (decision.flap) {
        this.altitude += settings.flapStrengthGround;
        if (this.altitude > 2.5) this.altitude = 2.5;
        this.state = "FLYING";
        this.flapAnim = 1.0;
      }
    } else if (this.state === "FLYING") {
      if (decision.flap) {
        this.altitude += settings.flapStrengthAir;
        if (this.altitude > 2.5) this.altitude = 2.5;
        this.flapAnim = 1.0;
      } else {
        this.altitude -= settings.gravity;
      }

      this.vx += decision.dx * 0.05;
      this.vy += decision.dy * 0.05;

      if (this.altitude <= 0.5) {
        this.altitude = 0.5;
        this.state = "LANDED";
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    // Clamp position
    if (this.x < margin) {
      this.x = margin;
      this.vx *= -0.5;
    } else if (this.x > canvas.width - margin) {
      this.x = canvas.width - margin;
      this.vx *= -0.5;
    }

    const yBottomLimit = canvas.height - margin - spriteHalfHeight;
    const yTopLimit = margin + spriteHalfHeight;

    if (this.y > yBottomLimit) {
      this.y = yBottomLimit;
      this.vy = 0;
    } else if (this.y < yTopLimit) {
      this.y = yTopLimit;
      this.vy = 0;
    }

    this.altitude = Math.max(0.5, Math.min(this.altitude, 2.5));
    this.spriteMode = "FLY";
    this.flapAnim *= 0.9;
    this.vx *= 0.95;
    this.vy *= 0.95;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.state === "LANDED") {
      drawLandedBird(ctx);
    } else {
      drawFlyingBird(ctx, this);
    }
    ctx.restore();
  }
}