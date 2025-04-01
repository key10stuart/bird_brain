// ui/debugPanel.js
import { settings } from "../core/settings.js";

export function createDebugPanel() {
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
}
