// core/gameLoop.js

import { canvas, ctx } from "./input.js";
import { PlayerBird } from "../entities/PlayerBird.js";
import { NPCBird } from "../entities/NPCbird.js";
import { drawMap } from "../draw/drawMap.js";
import {
  updateResources,
  drawResources,
  getNearestResource
} from "../entities/Resources.js";
import { settings } from "./settings.js";

const player = new PlayerBird();
const npcBirds = [
  new NPCBird(100, 150),
  new NPCBird(300, 200),
  new NPCBird(500, 250)
];

function spawnBirdCallback(x, y, brain) {
  const newBird = new NPCBird(x, y, brain);
  npcBirds.push(newBird);
}

let lastBirdSpawnTime = 0;

export function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🚨 Visual alert if any bird escapes
  for (const npc of npcBirds) {
    if (npc.y > canvas.height + 10) {
      ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      break;
    }
  }

  drawMap();

  updateResources(player);
  drawResources();

  for (let i = npcBirds.length - 1; i >= 0; i--) {
    const npc = npcBirds[i];
    updateResources(npc);
    npc.update(spawnBirdCallback);
    if (npc.dead) {
      npcBirds.splice(i, 1);
    } else {
      npc.draw(ctx);
    }
  }

  // 🐣 Bird spawner logic
  const now = performance.now();
  if (settings.birdSpawnRate === 1 && now - lastBirdSpawnTime > 1000) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    npcBirds.push(new NPCBird(x, y));
    lastBirdSpawnTime = now;
  }

  player.update();
  player.draw(ctx);

  // 📊 Live bird count (top right)
  ctx.font = "16px monospace";
  ctx.fillStyle = "white";
  ctx.textAlign = "right";
  ctx.fillText(`Birds: ${npcBirds.length}`, canvas.width - 10, 50);

  requestAnimationFrame(gameLoop);
}
