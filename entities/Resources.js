// entities/resources.js

import { ctx, canvas } from "../core/input.js";

const TYPES = {
  BERRY: { color: 'red', radius: 5, energy: 10 },
  SEED:  { color: 'saddlebrown', radius: 4, energy: 5 },
  BUG:   { color: 'black', radius: 6, energy: 15 }
};

const resources = [];

function spawnResource(type, x, y) {
  const t = TYPES[type];
  resources.push({
    type,
    x,
    y,
    radius: t.radius,
    energy: t.energy,
    color: t.color
  });
}

function spawnRandomResources(count = 5) {
  const typeKeys = Object.keys(TYPES);
  for (let i = 0; i < count; i++) {
    const randType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    spawnResource(randType, x, y);
  }
}

// ⏱️ Timed spawning
let lastSpawnTime = 0;
const spawnInterval = 3000; // ms

function updateResources(entity) {
  const now = performance.now();
  if (now - lastSpawnTime > spawnInterval) {
    spawnRandomResources(1);
    lastSpawnTime = now;
  }

  for (let i = resources.length - 1; i >= 0; i--) {
    const r = resources[i];
    const dx = entity.x - r.x;
    const dy = entity.y - r.y;
    const dist = Math.hypot(dx, dy);
    if (dist < r.radius + entity.radius) {
      entity.energy = (entity.energy || 0) + r.energy;
      resources.splice(i, 1);
    }
  }
}

function drawResources() {
  for (const r of resources) {
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
    ctx.fillStyle = r.color;
    ctx.fill();
  }
}

function getNearestResource(x, y) {
  let minDist = Infinity;
  let closest = null;

  for (const r of resources) {
    const dx = x - r.x;
    const dy = y - r.y;
    const dist = dx * dx + dy * dy;
    if (dist < minDist) {
      minDist = dist;
      closest = r;
    }
  }

  return closest;
}

export {
  resources,
  spawnResource,
  spawnRandomResources,
  updateResources,
  drawResources,
  getNearestResource
};
