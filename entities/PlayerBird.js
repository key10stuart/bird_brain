// entities/PlayerBird.js
import { canvas, mouse } from "../core/input.js";
import { settings } from "../core/settings.js";
import { drawFlyingBird, drawLandedBird } from "../draw/drawBird.js";

export class PlayerBird {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = 10; // Or whatever matches your ellipse size
    this.vx = 0;
    this.vy = 0;
    this.state = "LANDED";
    this.altitude = 0.5;
    this.angle = 0;
    this.flapAnim = 0;
    this.mouseDownTime = 0;
    this.wasMouseDown = false;
    this.spriteMode = "FLY";
  }

  update() {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    const dirX = dx / dist;
    const dirY = dy / dist;

    let currentFollowSpeed = settings.followSpeed;

    if (mouse.isDown) {
      this.mouseDownTime++;
    } else {
      if (this.wasMouseDown && this.mouseDownTime > 0 && this.mouseDownTime <= 15) {
        if (this.state === "LANDED") {
          this.altitude += settings.flapStrengthGround;
          if (this.altitude > 2.5) this.altitude = 2.5;
          this.state = "FLYING";
          this.flapAnim = 1.0;
        } else {
          this.altitude += settings.flapStrengthAir;
          if (this.altitude > 2.5) this.altitude = 2.5;
          this.flapAnim = 1.0;
        }
      }
      this.mouseDownTime = 0;
    }
    this.wasMouseDown = mouse.isDown;

    const overMouse = Math.abs(mouse.x - this.x) < 10 && Math.abs(mouse.y - this.y) < 10;
    this.diving = this.state === "FLYING" && overMouse;
    this.spriteMode = this.diving ? "DIVE" : "FLY";

    if (this.state === "LANDED") {
      this.altitude = 0.5;
      if (mouse.isDown && this.mouseDownTime >= 10) {
        this.vx = dirX * currentFollowSpeed;
        this.vy = dirY * currentFollowSpeed;
      } else {
        this.vx = 0;
        this.vy = 0;
      }
    } else if (this.state === "FLYING") {
      if (this.diving) {
        this.altitude -= settings.gravity * 3.0;
      } else if (mouse.isDown && this.mouseDownTime >= 10) {
        this.altitude -= settings.gravity * (1 - settings.glide_grav);
        currentFollowSpeed *= settings.glide_affect;
      } else {
        this.altitude -= settings.gravity;
      }

      this.vx = dirX * currentFollowSpeed;
      this.vy = dirY * currentFollowSpeed;

      if (this.altitude <= 0.5) {
        this.altitude = 0.5;
        this.state = "LANDED";
      }
      if (this.altitude > 2.5) this.altitude = 2.5;
    }

    if (dist > settings.angleDeadzone) {
      this.angle = Math.atan2(dy, dx);
    }

    this.x += this.vx;
    this.y += this.vy;

    const margin = 10;
    this.x = Math.max(margin, Math.min(canvas.width - margin, this.x));
    this.y = Math.max(margin, Math.min(canvas.height - margin, this.y));

    this.flapAnim *= 0.9;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    if (this.state === "LANDED") {
      drawLandedBird(ctx);
    } else {
      drawFlyingBird(ctx, this);
    }
    ctx.restore();
  }
}
