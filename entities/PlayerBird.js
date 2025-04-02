// entities/PlayerBird.js
import { canvas, mouse } from "../core/input.js";
import { settings } from "../core/settings.js";
import { drawFlyingBird, drawLandedBird } from "../draw/drawBird.js";
import { updateBirdPhysics } from "../core/birdPhysics.js";
import { BaseBird } from "./BaseBird.js";

export class PlayerBird {
  constructor() {
    this.birdBody = new BaseBird(canvas.width / 2, canvas.height / 2);
    this.mouseDownTime = 0;
    this.wasMouseDown = false;
    this._actionIndex = 3; // default to IDLE
    this.birdBody.collisionCooldown = 0; // support collision cooldown
  }

  update(allBirds = []) {
    const dx = mouse.x - this.birdBody.x;
    const dy = mouse.y - this.birdBody.y;
    const dist = Math.hypot(dx, dy) || 1;
    const dirX = dx / dist;
    const dirY = dy / dist;

    if (mouse.isDown) {
      this.mouseDownTime++;
    } else {
      if (this.wasMouseDown && this.mouseDownTime > 0 && this.mouseDownTime <= 15) {
        this._actionIndex = 1; // FLAP
      } else {
        this._actionIndex = 3; // IDLE
      }
      this.mouseDownTime = 0;
    }

    if (mouse.isDown && this.mouseDownTime >= 10) {
      this._actionIndex = (this.birdBody.state === "LANDED") ? 0 : 2; // WALK or GLIDE
    }

    this.wasMouseDown = mouse.isDown;

    if (dist > settings.angleDeadzone) {
      this.birdBody.angle = Math.atan2(dy, dx);
    }

    updateBirdPhysics(this.birdBody, {
      actionIndex: this._actionIndex,
      dirX,
      dirY
    }, allBirds, mouse.x, mouse.y);
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.birdBody.x, this.birdBody.y);
    ctx.rotate(this.birdBody.angle);

    if (this.birdBody.state === "FLYING") {
      drawFlyingBird(ctx, this.birdBody);
    } else {
      drawLandedBird(ctx);
    }

    ctx.restore();
  }
}
