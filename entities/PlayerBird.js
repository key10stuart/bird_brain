// entities/PlayerBird.js

import { canvas, mouse } from "../core/input.js";
import { settings } from "../core/settings.js";
import { updateBirdPhysics } from "../core/birdPhysics.js";
import { BaseBird } from "./BaseBird.js";

export class PlayerBird {
  constructor() {
    this.birdBody = new BaseBird(canvas.width / 2, canvas.height / 2);
    this.mouseDownTime = 0;
    this.wasMouseDown = false;
    this._actionIndex = 3; // IDLE by default
    this.birdBody.collisionCooldown = 0;
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

    const angleDeadzone = settings.angleDeadzone ?? 8;
    if (dist > angleDeadzone) {
      this.birdBody.angle = Math.atan2(dy, dx);
    }

    updateBirdPhysics(this.birdBody, {
      actionIndex: this._actionIndex,
      dirX,
      dirY
    }, allBirds, mouse.x, mouse.y);
  }

  // ==== Getter/setter passthroughs to make PlayerBird duck-compatible ====

  get x() { return this.birdBody.x; }
  set x(value) { this.birdBody.x = value; }

  get y() { return this.birdBody.y; }
  set y(value) { this.birdBody.y = value; }

  get angle() { return this.birdBody.angle; }
  set angle(value) { this.birdBody.angle = value; }

  get altitude() { return this.birdBody.altitude; }
  set altitude(value) { this.birdBody.altitude = value; }

  get state() { return this.birdBody.state; }
  set state(value) { this.birdBody.state = value; }

  get spriteMode() { return this.birdBody.spriteMode; }
  set spriteMode(value) { this.birdBody.spriteMode = value; }

  get flapAnim() { return this.birdBody.flapAnim; }
  set flapAnim(value) { this.birdBody.flapAnim = value; }

  // Optional: For rendering, access birdBody directly
  get drawable() {
    return this.birdBody;
  }
}
