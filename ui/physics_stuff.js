// ui/physics_stuff.js
import { settings } from "../core/settings.js";

let panel;

export function createPhysicsPanel() {
  if (panel) return;

  panel = document.createElement("div");
  panel.id = "physicsPanel";
  panel.style.position = "absolute";
  panel.style.top = "10px";
  panel.style.right = "10px";
  panel.style.background = "rgba(40, 40, 40, 0.95)";
  panel.style.padding = "12px";
  panel.style.color = "white";
  panel.style.fontFamily = "monospace";
  panel.style.zIndex = "10001";
  panel.style.border = "1px solid #888";
  panel.style.borderRadius = "6px";
  panel.style.minWidth = "220px";

  const title = document.createElement("div");
  title.textContent = "⚙️ Physics Settings";
  title.style.marginBottom = "10px";
  title.style.fontWeight = "bold";
  panel.appendChild(title);

  const sliders = [
    { name: "gravity", min: 0.01, max: 0.1, step: 0.001 },
    { name: "glide_grav", min: 0.1, max: 1.0, step: 0.01 },
    { name: "glide_affect", min: 0.1, max: 2.0, step: 0.01 },
    { name: "followSpeed", min: 0.1, max: 5.0, step: 0.1 },
    { name: "flapStrengthAir", min: 0.1, max: 2.0, step: 0.01 },
    { name: "flapStrengthGround", min: 0.1, max: 2.0, step: 0.01 }
  ];

  sliders.forEach(({ name, min, max, step }) => {
    const initialValue = settings[name] !== undefined ? settings[name] : (min + max) / 2;

    // Fallback to midpoint if setting is missing
    if (settings[name] === undefined) {
      settings[name] = initialValue;
    }

    const label = document.createElement("label");
    label.textContent = `${name}: `;

    const input = document.createElement("input");
    input.type = "range";
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = initialValue;
    input.style.width = "100px";

    const valueDisplay = document.createElement("span");
    valueDisplay.textContent = initialValue;
    valueDisplay.style.marginLeft = "8px";

    input.oninput = () => {
      settings[name] = parseFloat(input.value);
      valueDisplay.textContent = input.value;
    };

    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "6px";
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    wrapper.appendChild(valueDisplay);
    panel.appendChild(wrapper);
  });

  document.body.appendChild(panel);
}

export function destroyPhysicsPanel() {
  if (panel) {
    panel.remove();
    panel = null;
  }
}
