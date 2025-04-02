// birdPhysics.js
import { settings } from "./settings.js";
import { canvas } from "./input.js";

const ALTITUDE_MARGIN = 0.3;
const COLLISION_RADIUS = 20;
const BOUNCE_FORCE = 1.5;
const COLLISION_COOLDOWN_FRAMES = 60;
const DIVE_PROXIMITY = 20; // expanded dive trigger area

export function updateBirdPhysics(bird, decision, allBirds = [], targetX = null, targetY = null) {
  const { actionIndex, dirX, dirY } = decision;

  const margin = 10;
  const spriteHalfHeight = bird.bodyHeight + 5;
  const flapCooldownFrames = settings.flapCooldown ?? 20;
  const maxSpeed = settings.maxSpeed ?? 2.5;
  const glideAffect = settings.glide_affect ?? 0.5;

  if (bird.flapCooldown > 0) bird.flapCooldown--;
  if (bird.collisionCooldown > 0) bird.collisionCooldown--;

  let diving = false;

  if (bird.collisionCooldown === 0) {
    if (bird.state === "LANDED") {
      bird.altitude = 0;

      if (actionIndex === 0) {
        bird.vx = dirX * settings.followSpeed;
        bird.vy = dirY * settings.followSpeed;
      } else if (actionIndex === 1 && bird.flapCooldown <= 0) {
        bird.altitude += settings.flapStrengthGround;
        bird.altitude = Math.min(bird.altitude, 2.5);
        bird.state = "FLYING";
        bird.flapAnim = 1.0;
        bird.flapCooldown = flapCooldownFrames;
      }
    }

    if (bird.state === "FLYING") {
      const effectiveGravity = (actionIndex === 2)
        ? settings.gravity * settings.glide_grav
        : settings.gravity;
      bird.altitude -= effectiveGravity;

      if (actionIndex === 2) {
        // Handle proximity dive trigger
        if (targetX !== null && targetY !== null) {
          const dx = targetX - bird.x;
          const dy = targetY - bird.y;
          const proximity = Math.hypot(dx, dy);

          if (proximity < DIVE_PROXIMITY) {
            diving = true;
            bird.altitude -= settings.gravity * 2;

            // Stop steering to prevent erratic shaking
            bird.vx *= 0.9;
            bird.vy *= 0.9;
          } else {
            bird.vx += dirX * settings.followSpeed * glideAffect;
            bird.vy += dirY * settings.followSpeed * glideAffect;
          }
        }
      } else if (actionIndex === 1) {
        bird.vx += dirX * settings.followSpeed;
        bird.vy += dirY * settings.followSpeed;

        if (bird.flapCooldown <= 0) {
          bird.altitude += settings.flapStrengthAir;
          bird.altitude = Math.min(bird.altitude, 2.5);
          bird.flapAnim = 1.0;
          bird.flapCooldown = flapCooldownFrames;
        }
      }

      if (bird.altitude <= 0) {
        bird.altitude = 0;
        bird.state = "LANDED";
      }
    }
  }

  bird.x += bird.vx;
  bird.y += bird.vy;

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
