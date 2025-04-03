// birdPhysics.js
import { settings } from "./settings.js";
import { canvas } from "./input.js";
import { getScaledDelta } from "./timeControl.js";

const ALTITUDE_MARGIN = 0.3;
const COLLISION_RADIUS = 20;
const BOUNCE_FORCE = 1.5;
const COLLISION_COOLDOWN_FRAMES = 60;

export function updateBirdPhysics(bird, decision, allBirds = [], targetX = null, targetY = null) {
  const delta = getScaledDelta();
  const deltaFactor = delta / 16;

  const { actionIndex, dirX, dirY, glideDuration = 0 } = decision;

  const margin = 10;
  const spriteHalfHeight = bird.bodyHeight + 5;
  const flapCooldownFrames = settings.flapCooldown ?? 20;
  const maxSpeed = settings.maxSpeed ?? 2.5;
  const glideAffect = bird.glide_affect ?? settings.glide_affect ?? 0.5;

  if (bird.flapCooldown > 0) bird.flapCooldown -= deltaFactor;
  if (bird.collisionCooldown > 0) bird.collisionCooldown -= deltaFactor;

  let diving = false;

  const thrustX = Math.cos(bird.angle);
  const thrustY = Math.sin(bird.angle);

  const overMouse = targetX !== null && targetY !== null &&
    Math.abs(targetX - bird.x) < 10 &&
    Math.abs(targetY - bird.y) < 10;

  if (bird.collisionCooldown <= 0) {
    if (bird.state === "LANDED") {
      bird.altitude = 0;

      if (actionIndex === 0) {
        bird.vx = thrustX * settings.followSpeed;
        bird.vy = thrustY * settings.followSpeed;
      } else if (actionIndex === 1) {
        if (bird.flapCooldown <= 0) {
          bird.altitude += settings.flapStrengthGround;
          bird.altitude = Math.min(bird.altitude, 2.5);

          const groundFlapThrust = settings.followSpeed * (settings.flapStrengthGround / 1.5);
          bird.vx = thrustX * groundFlapThrust;
          bird.vy = thrustY * groundFlapThrust;

          bird.state = "FLYING";
          bird.flapAnim = 1.0;
          bird.flapCooldown = flapCooldownFrames;
        }
      }
    }

    if (bird.state === "FLYING") {
      if (overMouse) {
        diving = true;
        bird.altitude -= settings.gravity * 3.0;
      } else if (actionIndex === 2) {
        if (targetX !== null && targetY !== null) {
          const dx = targetX - bird.x;
          const dy = targetY - bird.y;
          const dist = Math.hypot(dx, dy) || 1;

          const desiredX = dx / dist;
          const desiredY = dy / dist;

          const forwardGlideFactor = settings.followSpeed * glideAffect * deltaFactor;
          const downwardGlideFactor = 0.1 * settings.gravity * deltaFactor;

          bird.vx += desiredX * forwardGlideFactor;
          bird.vy += desiredY * forwardGlideFactor;
          bird.altitude -= downwardGlideFactor;
        } else {
          bird.altitude -= settings.gravity * settings.glide_grav * deltaFactor;
        }
      } else {
        bird.altitude -= settings.gravity * deltaFactor;
      }

      if (actionIndex === 1 && bird.flapCooldown <= 0) {
        bird.vx += thrustX * settings.followSpeed;
        bird.vy += thrustY * settings.followSpeed;
        bird.altitude += settings.flapStrengthAir;
        bird.altitude = Math.min(bird.altitude, 2.5);
        bird.flapAnim = 1.0;
        bird.flapCooldown = flapCooldownFrames;
      }

      if (bird.altitude <= 0) {
        bird.altitude = 0;
        bird.state = "LANDED";
      }
    }
  }

  bird.x += bird.vx * deltaFactor;
  bird.y += bird.vy * deltaFactor;

  const speed = Math.hypot(bird.vx, bird.vy);
  if (speed > maxSpeed) {
    const scale = maxSpeed / speed;
    bird.vx *= scale;
    bird.vy *= scale;
  }

  for (const other of allBirds) {
    if (other === bird) continue;
    const altDiff = Math.abs(bird.altitude - other.altitude);
    if (altDiff <= ALTITUDE_MARGIN) {
      const dx = bird.x - other.x;
      const dy = bird.y - other.y;
      const distSq = dx * dx + dy * dy;
      const minDist = COLLISION_RADIUS * 2;

      if (distSq < minDist * minDist) {
        const dist = Math.sqrt(distSq) || 1;
        const nx = dx / dist;
        const ny = dy / dist;

        bird.vx += nx * BOUNCE_FORCE;
        bird.vy += ny * BOUNCE_FORCE;

        other.vx -= nx * BOUNCE_FORCE;
        other.vy -= ny * BOUNCE_FORCE;

        bird.collisionCooldown = COLLISION_COOLDOWN_FRAMES;
        other.collisionCooldown = COLLISION_COOLDOWN_FRAMES;
      }
    }
  }

  bird.x = Math.max(margin, Math.min(bird.x, canvas.width - margin));
  bird.y = Math.max(margin + spriteHalfHeight, Math.min(bird.y, canvas.height - margin - spriteHalfHeight));

  bird.altitude = Math.max(0, Math.min(bird.altitude, 2));
  bird.vx *= 0.90;
  bird.vy *= 0.90;
  bird.flapAnim *= 0.9;

  if (bird.state === "FLYING") {
    if (diving) {
      bird.spriteMode = "DIVE";
    } else {
      bird.spriteMode = (actionIndex === 2) ? "GLIDE" : (actionIndex === 1) ? "FLAP" : "FLY";
    }
  } else {
    bird.spriteMode = "FLY";
  }
}
