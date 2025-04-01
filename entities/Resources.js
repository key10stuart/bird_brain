// entities/resources.js

import { ctx, canvas } from "../core/input.js";
import { settings } from "../core/settings.js";

const TYPES = {
  BERRY: { color: 'red', radius: 5, energy: 10 },
  SEED:  { color: 'saddlebrown', radius: 4, energy: 5 },
  BUG:   { color: 'black', radius: 6, energy: 15 }
};

const resources = [];
const MAX_RESOURCES = 100;

function spawnResource(type, x, y) {
  if (resources.length >= MAX_RESOURCES) return;
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
  const maxRadius = Math.max(...Object.values(TYPES).map(t => t.radius));
  for (let i = 0; i < count && resources.length < MAX_RESOURCES; i++) {
    const randType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
    const x = maxRadius + Math.random() * (canvas.width - 2 * maxRadius);
    const y = maxRadius + Math.random() * (canvas.height - 2 * maxRadius);
    spawnResource(randType, x, y);
  }
}

// ⏱️ Dynamic spawning interval based on settings
let lastSpawnTime = 0;
const baseInterval = 1000; // ms per unit rate (e.g. 1000ms / 5 = 200ms interval)

function updateResources(entity) {
  const now = performance.now();
  const rate = settings.resourceSpawnRate ?? 1;

  if (rate > 0) {
    const spawnInterval = baseInterval / rate;
    if (now - lastSpawnTime > spawnInterval && resources.length < MAX_RESOURCES) {
      spawnRandomResources(1);
      lastSpawnTime = now;
    }
  }

  for (let i = resources.length - 1; i >= 0; i--) {
    const r = resources[i];
    const dx = entity.x - r.x;
    const dy = entity.y - r.y;
    const dist = Math.hypot(dx, dy);
    if (dist < r.radius + entity.radius) {
      if (typeof entity.feed === 'function') {
        entity.feed(r.energy);
      } else {
        entity.energy = (entity.energy || 0) + r.energy;
      }
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
