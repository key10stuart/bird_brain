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

  drawMap();

  // Food logic
  updateResources(player);
  drawResources();

  // NPC birds
  for (const npc of npcBirds) {
    updateResources(npc); // They can eat too!
    const target = getNearestResource(npc.x, npc.y);
    npc.update(target);
    npc.draw(ctx);
  }

  // Player
  player.update();
  player.draw(ctx);

  requestAnimationFrame(gameLoop);
}
