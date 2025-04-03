// draw/renderScene.js

import { drawMap } from "./drawMap.js";
import { drawResources } from "./drawResources.js";
import { drawBirds } from "./drawBirds.js";
import { settings } from "../core/settings.js";

export function renderScene(ctx, { player, npcBirds }) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  drawMap(ctx, settings.devMode);
  drawResources(ctx);
  drawBirds(ctx, player, npcBirds); // 👈 this triggers all bird drawing
  
}
