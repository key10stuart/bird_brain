// birdPhysics.js
import { settings } from "../core/settings.js";
import { canvas } from "../core/input.js";

export function updateBirdPhysics(bird, decision) {
  const { actionIndex, dirX, dirY } = decision;

  const margin = 10;
  const spriteHalfHeight = bird.bodyHeight + 5;
  const flapCooldownFrames = settings.flapCooldown ?? 20;
  const maxSpeed = settings.maxSpeed ?? 2.5;
  const glideAffect = settings.glide_affect ?? 0.5;

  if (bird.flapCooldown > 0) bird.flapCooldown--;

  if (actionIndex !== 3) {
    if (bird.state === "LANDED") {
      bird.altitude = 0.5;
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
    } else if (bird.state === "FLYING") {
      if (actionIndex === 1 && bird.flapCooldown <= 0) {
        bird.altitude += settings.flapStrengthAir;
        bird.altitude = Math.min(bird.altitude, 2.5);
        bird.flapAnim = 1.0;
        bird.flapCooldown = flapCooldownFrames;
      } else {
        const effectiveGravity = (actionIndex === 2)
          ? settings.gravity * settings.glide_grav
          : settings.gravity;
        bird.altitude -= effectiveGravity;
      }

      if (actionIndex === 2) {
        bird.vx += dirX * settings.followSpeed * glideAffect;
        bird.vy += dirY * settings.followSpeed * glideAffect;
      } else if (actionIndex === 1) {
        bird.vx += dirX * settings.followSpeed;
        bird.vy += dirY * settings.followSpeed;
      }

      if (bird.altitude <= 0.5) {
        bird.altitude = 0.5;
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

  bird.x = Math.max(margin, Math.min(bird.x, canvas.width - margin));
  bird.y = Math.max(margin + spriteHalfHeight, Math.min(bird.y, canvas.height - margin - spriteHalfHeight));

  bird.altitude = Math.max(0.5, Math.min(bird.altitude, 2.5));
  bird.vx *= 0.90;
  bird.vy *= 0.90;
  bird.flapAnim *= 0.9;

  if (bird.state === "FLYING") {
    bird.spriteMode = (actionIndex === 2) ? "GLIDE" : (actionIndex === 1) ? "FLAP" : "FLY";
  } else {
    bird.spriteMode = "FLY";
  }
}
