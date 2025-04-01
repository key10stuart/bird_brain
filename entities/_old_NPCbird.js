import { settings } from "../core/settings.js";
import { canvas } from "../core/input.js";
import { drawFlyingBird, drawLandedBird } from "../draw/drawBird.js";
import { getNearestResource } from "../entities/Resources.js";
import { forward, createHardCodedNN } from "../agents/brains.js";

function cloneBrain(brain) {
  return JSON.parse(JSON.stringify(brain));
}

function mutate(brain, rate = 0.1, magnitude = 0.5) {
  for (const layer of ['w1', 'w2']) {
    brain[layer] = brain[layer].map(row =>
      row.map(w => (Math.random() < rate ? w + (Math.random() * 2 - 1) * magnitude : w))
    );
  }
  return brain;
}

function argMax(arr) {
  return arr.reduce((maxIdx, val, idx, a) => (val > a[maxIdx] ? idx : maxIdx), 0);
}

export class NPCBird {
  constructor(x, y, brain = null, energy = 50) {
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

    this.energy = energy;
    this.brain = brain || createHardCodedNN();

    this.angle = 0;
    this.flapCooldown = 0;
    this.feedCooldownFrames = 0;
  }

  feed(amount = 20) {
    if (this.feedCooldownFrames > 0) return;
    this.energy = Math.min(100, this.energy + amount);
    this.feedCooldownFrames = 5 * (settings.fps ?? 60);
  }

  think() {
    const w = canvas?.width ?? 800;
    const h = canvas?.height ?? 600;

    const resource = getNearestResource(this.x, this.y);
    const dx = resource ? (resource.x - this.x) : 0;
    const dy = resource ? (resource.y - this.y) : 0;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const safeDist = Math.max(dist, 1e-3);

    if (dist > 1) {
      const targetAngle = Math.atan2(dy, dx);
      const angleDiff = targetAngle - this.angle;
      const normalized = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
      this.angle += normalized * 0.2;
    }

    const input = [
      dx / w,
      dy / h,
      this.vx,
      this.vy,
      this.altitude / 2.5,
      this.energy / 100,
      dist,
      1,
    ];

    const output = forward(this.brain, input);
    const actionIndex = argMax(output);

    return {
      actionIndex,
      dirX: dx / safeDist,
      dirY: dy / safeDist,
    };
  }

  update(spawnBirdCallback) {
    const margin = 10;
    const spriteHalfHeight = this.bodyHeight + 5;
    const flapCooldownFrames = settings.flapCooldown ?? 20;
    const maxSpeed = settings.maxSpeed ?? 2.5;
    const glideAffect = settings.glide_affect ?? 0.5;

    this.energy -= settings.resourceDrainRate || 0.1;
    if (this.energy <= 0) {
      this.dead = true;
      return;
    }

    if (this.feedCooldownFrames > 0) {
      this.feedCooldownFrames--;
      this.state = "LANDED";
      this.altitude = 0.5;
      this.vx = 0;
      this.vy = 0;
      return;
    }

    const { actionIndex, dirX, dirY } = this.think();

    if (this.flapCooldown > 0) this.flapCooldown--;

    if (this.energy >= 100) {
      this.energy = 50;
      const childBrain = mutate(cloneBrain(this.brain));
      if (spawnBirdCallback) {
        spawnBirdCallback(this.x + (Math.random() - 0.5) * 30, this.y + (Math.random() - 0.5) * 30, childBrain);
      }
    }

    if (actionIndex !== 3) {
      if (this.state === "LANDED") {
        this.altitude = 0.5;
        if (actionIndex === 0) {
          this.vx = dirX * settings.followSpeed;
          this.vy = dirY * settings.followSpeed;
        } else if (actionIndex === 1 && this.flapCooldown <= 0) {
          this.altitude += settings.flapStrengthGround;
          this.altitude = Math.min(this.altitude, 2.5);
          this.state = "FLYING";
          this.flapAnim = 1.0;
          this.flapCooldown = flapCooldownFrames;
        }
      } else if (this.state === "FLYING") {
        if (actionIndex === 1 && this.flapCooldown <= 0) {
          this.altitude += settings.flapStrengthAir;
          this.altitude = Math.min(this.altitude, 2.5);
          this.flapAnim = 1.0;
          this.flapCooldown = flapCooldownFrames;
        } else {
          this.altitude -= settings.gravity;
        }

        if (actionIndex === 2) {
          this.vx += dirX * settings.followSpeed * glideAffect;
          this.vy += dirY * settings.followSpeed * glideAffect;
        } else if (actionIndex === 1) {
          this.vx += dirX * settings.followSpeed;
          this.vy += dirY * settings.followSpeed;
        }

        if (this.altitude <= 0.5) {
          this.altitude = 0.5;
          this.state = "LANDED";
        }
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    const speed = Math.hypot(this.vx, this.vy);
    if (speed > maxSpeed) {
      const scale = maxSpeed / speed;
      this.vx *= scale;
      this.vy *= scale;
    }

    this.x = Math.max(margin, Math.min(this.x, canvas.width - margin));
    this.y = Math.max(margin + spriteHalfHeight, Math.min(this.y, canvas.height - margin - spriteHalfHeight));

    this.altitude = Math.max(0.5, Math.min(this.altitude, 2.5));
    this.vx *= 0.90;
    this.vy *= 0.90;
    this.flapAnim *= 0.9;

    // Determine sprite mode
    if (this.state === "FLYING") {
      this.spriteMode = (actionIndex === 2) ? "GLIDE" : (actionIndex === 1) ? "FLAP" : "FLY";
    } else {
      this.spriteMode = "FLY";
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    if (settings.debugBird) {
      const resource = getNearestResource(this.x, this.y);
      if (resource && Number.isFinite(resource.x) && Number.isFinite(resource.y)) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(resource.x - this.x, resource.y - this.y);
        ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (!this._debugTick) this._debugTick = 0;
        if (++this._debugTick % 60 === 0) {
          console.log(`[DEBUG] NPCBird @ (${this.x.toFixed(1)}, ${this.y.toFixed(1)}) → Resource @ (${resource.x.toFixed(1)}, ${resource.y.toFixed(1)})`);
        }
      }
    }

    ctx.rotate(this.angle);

    if (this.state === "LANDED") {
      drawLandedBird(ctx);
    } else {
      drawFlyingBird(ctx, this);
    }

    ctx.restore();
  }
}
