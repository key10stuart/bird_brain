// core/settings.js
export const settings = {
  // physics settings
    gravity: 0.021,
    glide_grav: 0.7,
    glide_affect: 1.87,
    flapStrengthGround: 0.5,
    flapStrengthAir: 0.5,
    followSpeed: 1.0,
    angleDeadzone: 12, // pixels
    flapCooldown: 10, // frames
    maxSpeed: 2.5,
  // sim settings
    resourceDrainRate: 0.01, // much slower than 0.1
    debugBird: true,
    resourceSpawnRate: 0.2,  // 1 per second by default
    birdSpawnRate: 0,       // toggle: 1 = on, 0 = off
    simSpeed: 1.0, // ← default speed
  };
  