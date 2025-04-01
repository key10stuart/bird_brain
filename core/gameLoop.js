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

const player = new PlayerBird();
const npcBirds = [
  new NPCBird(100, 150),
  new NPCBird(300, 200),
  new NPCBird(500, 250)
];

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

  for (const npc of npcBirds) {
    updateResources(npc);
    const target = getNearestResource(npc.x, npc.y);
    npc.update(target);
    npc.draw(ctx);
  }

  player.update();
  player.draw(ctx);

  requestAnimationFrame(gameLoop);
}
