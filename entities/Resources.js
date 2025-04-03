// entities/Resources.js

import { canvas } from "../core/input.js";
import { settings } from "../core/settings.js";

const TYPES = {
  BERRY: { color: 'red', radius: 5, energy: 30 },
  SEED:  { color: 'saddlebrown', radius: 4, energy: 20 },
  BUG:   { color: 'black', radius: 6, energy: 50 }
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
  const MARGIN = maxRadius + 20;

  for (let i = 0; i < count && resources.length < MAX_RESOURCES; i++) {
    const randType = typeKeys[Math.floor(Math.random() * typeKeys.length)];
    const x = MARGIN + Math.random() * (canvas.width - 2 * MARGIN);
    const y = MARGIN + Math.random() * (canvas.height - 2 * MARGIN);
    spawnResource(randType, x, y);
  }
}

let accumulatedSpawnTime = 0;
const baseInterval = 1000;

function updateResources(entity, delta = 16) {
  const rate = settings.resourceSpawnRate ?? 1;

  if (rate > 0) {
    const spawnInterval = baseInterval / rate;
    accumulatedSpawnTime += delta * (settings.simSpeed || 1);

    while (accumulatedSpawnTime >= spawnInterval && resources.length < MAX_RESOURCES) {
      spawnRandomResources(1);
      accumulatedSpawnTime -= spawnInterval;
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
  getNearestResource
};
