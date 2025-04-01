// draw/drawMap.js
import { canvas, ctx } from "../core/input.js";

const mapImage = new Image();
mapImage.src = "./assets/bird_map_1.png";

export function drawMap() {
  if (mapImage.complete) {
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
  }
}
