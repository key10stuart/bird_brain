export class BaseBird {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.angle = 0;
      this.altitude = 0.5;
      this.state = "LANDED";
      this.flapAnim = 0;
      this.spriteMode = "FLY";
      this.flapCooldown = 0;
      this.bodyHeight = 10; // for margin math
    }
  }
  