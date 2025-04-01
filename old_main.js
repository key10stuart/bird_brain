// main.js
console.log("[main.js] Script loaded");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const mapImage = new Image();
mapImage.src = "./bird_map_1.png";

const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  isDown: false,
};

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});
canvas.addEventListener("mousedown", () => { mouse.isDown = true; });
canvas.addEventListener("mouseup", () => { mouse.isDown = false; });

const settings = {
  gravity: 0.021,
  glide_grav: 0.7,
  glide_affect: 1.87,
  flapStrengthGround: 0.5,
  flapStrengthAir: 0.5,
  followSpeed: 1.0,
  angleDeadzone: 12, // pixels
};

class Bird {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.vx = 0;
    this.vy = 0;
    this.state = "LANDED";
    this.altitude = 0.5;
    this.angle = 0;
    this.flapAnim = 0;
    this.mouseDownTime = 0;
    this.wasMouseDown = false;
    console.log("[Bird] Initialized at:", this.x, this.y, "State =", this.state);
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
          console.log("[Bird] FLAP from ground", this.altitude.toFixed(2));
          this.flapAnim = 1.0;
        } else {
          this.altitude += settings.flapStrengthAir;
          if (this.altitude > 2.5) this.altitude = 2.5;
          console.log("[Bird] FLAP in midair", this.altitude.toFixed(2));
          this.flapAnim = 1.0;
        }
      }
      this.mouseDownTime = 0;
    }
    this.wasMouseDown = mouse.isDown;

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
      if (mouse.isDown && this.mouseDownTime >= 10) {
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
        console.log("[Bird] LANDED");
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

function drawFlyingBird(ctx, bird) {
  ctx.scale(bird.altitude, bird.altitude);
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = "cyan";
  ctx.fill();

  const gliding = (mouse.isDown && bird.mouseDownTime >= 10);
  if (gliding) {
    drawWing(ctx, 0, -8, -22, -16);
    drawWing(ctx, 0, 8, -22, 16);
  } else {
    const fold = 16 * bird.flapAnim;
    drawWing(ctx, 0, -8, -16 + fold, -16);
    drawWing(ctx, 0, 8, -16 + fold, 16);
  }

  drawHead(ctx);
}

function drawLandedBird(ctx) {
  ctx.scale(0.4, 0.6);
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = "cyan";
  ctx.fill();

  drawWing(ctx, 0, -6, 6, -12);
  drawWing(ctx, 0, 6, 6, 12);
  drawHead(ctx);
}

function drawWing(ctx, baseX, baseY, tipX, tipY) {
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.lineTo(tipX, tipY);
  const offset = (baseY < 0) ? 6 : -6;
  ctx.lineTo(baseX, baseY + offset);
  ctx.closePath();
  ctx.fillStyle = "cyan";
  ctx.fill();
}

function drawHead(ctx) {
  ctx.beginPath();
  ctx.moveTo(12, 0);
  ctx.lineTo(8, -3);
  ctx.lineTo(8, 3);
  ctx.closePath();
  ctx.fillStyle = "orange";
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(6, -2, 2, 1, 0, 0, Math.PI * 2);
  ctx.ellipse(6, 2, 2, 1, 0, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
}

const bird = new Bird();

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (mapImage.complete) {
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
  }

  bird.update();
  bird.draw(ctx);
  requestAnimationFrame(gameLoop);
}
gameLoop();

const debugPanel = document.createElement("div");
debugPanel.style.position = "absolute";
debugPanel.style.top = "10px";
debugPanel.style.left = "10px";
debugPanel.style.background = "rgba(0,0,0,0.7)";
debugPanel.style.padding = "10px";
debugPanel.style.color = "white";
debugPanel.style.fontFamily = "monospace";
debugPanel.style.zIndex = "9999";
document.body.appendChild(debugPanel);

const sliders = [
  { name: "gravity", min: 0.01, max: 0.1, step: 0.001 },
  { name: "glide_grav", min: 0.5, max: 1, step: 0.01 },
  { name: "glide_affect", min: 1, max: 2, step: 0.01 },
  { name: "followSpeed", min: 1, max: 3, step: 0.1 },
  { name: "flapStrengthAir", min: 0.5, max: 1.5, step: 0.01 },
  { name: "flapStrengthGround", min: 0.5, max: 1.5, step: 0.01 },
];

sliders.forEach(({ name, min, max, step }) => {
  const label = document.createElement("label");
  label.textContent = `${name}: `;

  const input = document.createElement("input");
  input.type = "range";
  input.min = min;
  input.max = max;
  input.step = step;
  input.value = settings[name];
  input.style.width = "100px";
  input.oninput = () => {
    settings[name] = parseFloat(input.value);
    valueDisplay.textContent = input.value;
  };

  const valueDisplay = document.createElement("span");
  valueDisplay.textContent = input.value;

  const wrapper = document.createElement("div");
  wrapper.appendChild(label);
  wrapper.appendChild(input);
  wrapper.appendChild(valueDisplay);
  debugPanel.appendChild(wrapper);
});
