// main.js

import { gameLoop, resetGameState } from "./core/gameLoop.js";
import { createMainPanel } from "./ui/mainPanel.js";
import { spawnRandomResources } from "./entities/Resources.js";
import { onDevExit } from "./core/dev_env.js"; // ✅ add this

// Hook: when Dev Mode ends, reset the full simulation state
onDevExit(() => {
  resetGameState();
  spawnRandomResources(); // ✅ re-seed resources on exit
});

createMainPanel();
spawnRandomResources(); // initial seed
gameLoop();
