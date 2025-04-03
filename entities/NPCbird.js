import { settings } from "../core/settings.js";
import { canvas } from "../core/input.js";
import { getNearestResource } from "../entities/Resources.js";
import { forwardAttentionNet } from "../agents/bird_brains/all_you_need.js";
import { forwardMotorNet } from "../agents/bird_brains/motorCortex.js";
import { updateBirdPhysics } from "../core/birdPhysics.js";
import { checkAndSpawn } from "./spawnLogic.js";
import { getScaledDelta } from "../core/timeControl.js";
import { drawBird } from "../draw/drawBird.js";

const BirdStates = { FLYING: "FLYING", LANDED: "LANDED" };
const BirdActions = { WALK: 0, FLAP: 1, GLIDE: 2, IDLE: 3 };

function argMax(arr) {
  return arr.reduce((maxIdx, val, idx, a) => (val > a[maxIdx] ? idx : maxIdx), 0);
}

export class NPCBird {
  constructor(x, y, motorNet = null, energy = 50) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;

    this.altitude = 0.5;
    this.flapAnim = 0;
    this.spriteMode = "FLY";
    this.state = BirdStates.LANDED;

    this.radius = 10;
    this.bodyHeight = 7;

    this.energy = energy;
    this.brain = motorNet;
    this.angle = 0;
    this.flapCooldown = 0;
    this.feedCooldownFrames = 0;
    this.collisionCooldown = 0;

    this.attentionTarget = null;
    this.destination = null;

    this.attentionTimer = 0;
    this.destinationTimer = 0;
    this.motorDecision = null;
  }

  feed(amount = 20) {
    if (this.feedCooldownFrames > 0) return;
    this.energy += amount;
    this.feedCooldownFrames = 5 * (settings.fps ?? 60);
  }

  update(spawnBirdCallback, allBirds = []) {
    const delta = getScaledDelta();

    this.energy -= (settings.resourceDrainRate || 0.1) * (settings.simSpeed || 1);
    if (this.energy <= 0) {
      this.dead = true;
      return;
    }

    if (this.feedCooldownFrames > 0) {
      this.feedCooldownFrames -= (delta / 16);
      this.state = BirdStates.LANDED;
      this.altitude = 0.5;
      this.vx = 0;
      this.vy = 0;
      return;
    }

    this.attentionTimer += delta;
    this.destinationTimer += delta;

    const w = canvas?.width ?? 800;
    const h = canvas?.height ?? 600;

    const resource = getNearestResource(this.x, this.y);
    const dx = resource ? (resource.x - this.x) : 0;
    const dy = resource ? (resource.y - this.y) : 0;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    if (this.attentionTimer > 5000) {
      const input = [
        dx / w,
        dy / h,
        dist,
        this.energy / 100,
        resource?.type === "bug" ? 2 : resource?.type === "seed" ? 1 : 0,
      ];
      const attendProb = forwardAttentionNet(this.attentionSetter, input);
      this.attentionTarget = attendProb > 0.2 ? resource : null;
      this.attentionTimer = 0;
    }

    if (this.destinationTimer > 1000) {
      const attn = this.attentionTarget;
      const attnDx = attn ? attn.x - this.x : 0;
      const attnDy = attn ? attn.y - this.y : 0;

      const newDest = { x: this.x + dx, y: this.y + dy };
      const oldDest = this.destination;
      const distToOld = oldDest ? Math.hypot(oldDest.x - newDest.x, oldDest.y - newDest.y) : Infinity;

      const input = [
        this.x / w,
        this.y / h,
        this.vx,
        this.vy,
        this.state === BirdStates.FLYING ? 1 : 0,
        attnDx / w,
        attnDy / h,
        dx / w,
        dy / h,
        this.energy / 100,
        1
      ];
      this.motorDecision = forwardMotorNet(this.brain, input);
      if (distToOld > 20) {
        this.destination = newDest;
      }
      this.destinationTimer = 0;
    }

    const faceTarget = this.destination ?? this.attentionTarget;
    if (faceTarget) {
      const fx = faceTarget.x - this.x;
      const fy = faceTarget.y - this.y;
      const angleToTarget = Math.atan2(fy, fx);
      const deltaAngle = angleToTarget - this.angle;
      this.angle += Math.atan2(Math.sin(deltaAngle), Math.cos(deltaAngle)) * 0.1;
    }

    if (!this.motorDecision) return;

    const actionIndex = argMax(this.motorDecision.slice(0, 3));
    const glideDuration = this.motorDecision[3] * 3.0;

    updateBirdPhysics(this, {
      actionIndex,
      dirX: dx / dist,
      dirY: dy / dist,
      glideDuration
    }, allBirds, this.destination?.x, this.destination?.y);

    checkAndSpawn(this, (newBird) => {
      console.log(`🐣 Bird reproduced at (${this.x.toFixed(1)}, ${this.y.toFixed(1)})`);
      spawnBirdCallback(newBird);
    });
  }

  draw(ctx) {
    drawBird(ctx, this);
  }
}