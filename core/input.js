// core/input.js
export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

export const mouse = {
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
