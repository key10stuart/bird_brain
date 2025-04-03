// core/gameLoop.js

import { canvas, ctx } from "./input.js";
import { updateSimPanel } from "../ui/sim_stuff.js";
import { PlayerBird } from "../entities/PlayerBird.js";
import { settings } from "./settings.js";

import { createDefaultGenome } from "../evolution/genetics.js";
import { buildBirdFromGenome } from "../entities/birdBuilder.js";
import { passiveBirdSpawner } from "../entities/spawnLogic.js";
import { updateResources } from "../entities/Resources.js";
import { updateTime, getScaledDelta, getDelta } from "./timeControl.js";

import { renderScene } from "../draw/renderScene.js";
import { isDevMode, renderDevScene, getDevBird, onDevExit } from "./dev_env.js"; // <-- new

let player;
let npcBirds;

function spawnBirdCallback(newBird) {
  npcBirds.push(newBird);
}

export function resetGameState() {
  player = new PlayerBird();

  npcBirds = [
    buildBirdFromGenome(100, 150, createDefaultGenome()),
    buildBirdFromGenome(300, 200, createDefaultGenome()),
    buildBirdFromGenome(500, 250, createDefaultGenome()),
  ];
}

// Initialize once at startup
resetGameState();

export function gameLoop() {
  updateTime();
  const delta = getDelta();
  const scaledDelta = getScaledDelta();

  // === Update Phase ===
  if (!isDevMode()) {
    updateResources(player, delta);
    for (let i = npcBirds.length - 1; i >= 0; i--) {
      updateResources(npcBirds[i], delta);
    }

    for (let i = npcBirds.length - 1; i >= 0; i--) {
      const npc = npcBirds[i];
      npc.update(spawnBirdCallback);
      if (npc.dead) npcBirds.splice(i, 1);
    }

    passiveBirdSpawner(npcBirds, settings, delta);
    player.update();
    updateSimPanel({ birdCount: npcBirds.length });
  }

  // === Render Phase ===
  if (isDevMode()) {
    const devBird = getDevBird();
    renderDevScene(ctx, devBird);
  } else {
    renderScene(ctx, { player, npcBirds });
  }

  requestAnimationFrame(gameLoop);
}
