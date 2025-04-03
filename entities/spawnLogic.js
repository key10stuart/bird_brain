import { mutateGenome, createDefaultGenome } from "../evolution/genetics.js";
import { buildBirdFromGenome } from "./birdBuilder.js";
import { canvas } from "../core/input.js";

// 🐣 Reproduction-based spawn using genetic system
export function checkAndSpawn(parentBird, spawnBirdCallback) {
  if (parentBird.energy >= 90) {
    parentBird.energy -= 40;

    const parentGenome = parentBird.genome;
    if (!parentGenome) {
      console.warn("Parent bird has no genome!");
      return;
    }

    const childGenome = mutateGenome(parentGenome);
    const jitterX = (Math.random() - 0.5) * 30;
    const jitterY = (Math.random() - 0.5) * 30;
    const spawnX = parentBird.x + jitterX;
    const spawnY = parentBird.y + jitterY;

    const childBird = buildBirdFromGenome(spawnX, spawnY, childGenome);
    console.log(`🐣 Bird reproduced!`);
    spawnBirdCallback(childBird);
  }
}

// 🕒 Passive spawner scaled by sim speed and delta
let accumulatedSpawnTime = 0;
const baseInterval = 1000; // ms per spawn when birdSpawnRate = 1

export function passiveBirdSpawner(npcBirds, settings, delta = 16) {
  const rate = settings.birdSpawnRate ?? 0;
  if (rate <= 0) return;

  const interval = baseInterval / rate;
  accumulatedSpawnTime += delta * (settings.simSpeed || 1);

  while (accumulatedSpawnTime >= interval) {
    if (npcBirds.length >= (settings.maxBirds ?? 25)) {
      console.warn(`🚫 Max bird count (${settings.maxBirds}) reached. No new birds spawned.`);
      return;
    }

    accumulatedSpawnTime -= interval;

    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const genome = createDefaultGenome();
    const bird = buildBirdFromGenome(x, y, genome);
    npcBirds.push(bird);
  }
}
