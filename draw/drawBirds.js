// draw/drawBirds.js

import { drawBird } from "./drawBird.js";

export function drawBirds(ctx, player, npcBirds = []) {
  for (const bird of npcBirds) {
    drawBird(ctx, bird);
  }

  if (player?.birdBody) {
    drawBird(ctx, player.birdBody);
  }
}
