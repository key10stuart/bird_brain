// main.js
import { gameLoop } from "./core/gameLoop.js";
import { createDebugPanel } from "./ui/panel.js";
import { spawnRandomResources } from "./entities/Resources.js";

createDebugPanel();
spawnRandomResources();  // ← Spawn food at startup
gameLoop();
