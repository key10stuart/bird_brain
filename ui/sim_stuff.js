// ui/sim_stuff.js
import { settings } from "../core/settings.js";

let panel;
let infoBlock;

export function createSimPanel() {
  if (panel) return;

  panel = document.createElement("div");
  panel.id = "simPanel";
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
  panel.style.width = "260px";
  panel.style.height = "auto";
  panel.style.boxSizing = "border-box";

  const title = document.createElement("div");
  title.textContent = "🧪 Simulation Settings";
  title.style.marginBottom = "10px";
  title.style.fontWeight = "bold";
  panel.appendChild(title);

  const sliders = [
    { name: "resourceDrainRate", min: 0.01, max: 0.1, step: 0.005 },
    { name: "resourceSpawnRate", min: 0, max: 10, step: 1 },
    { name: "maxBirds", min: 5, max: 50, step: 1 },
    { name: "simSpeed", min: 1, max: 5.0, step: 0.5 }
  ];

  sliders.forEach(({ name, min, max, step }) => {
    const initialValue = settings[name] !== undefined ? settings[name] : (min + max) / 2;
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

  // Toggle for bird spawning
  const toggleWrapper = document.createElement("div");
  toggleWrapper.style.marginTop = "8px";

  const toggleLabel = document.createElement("label");
  toggleLabel.textContent = "birdSpawn: ";

  const toggleInput = document.createElement("input");
  toggleInput.type = "checkbox";

  if (settings.birdSpawnRate === undefined) {
    settings.birdSpawnRate = 0;
  }

  toggleInput.checked = settings.birdSpawnRate === 1;
  toggleInput.onchange = () => {
    settings.birdSpawnRate = toggleInput.checked ? 1 : 0;
  };

  toggleWrapper.appendChild(toggleLabel);
  toggleWrapper.appendChild(toggleInput);
  panel.appendChild(toggleWrapper);

  // 🐦 Info block (live values like bird count)
  infoBlock = document.createElement("div");
  infoBlock.id = "simInfo";
  infoBlock.style.marginTop = "10px";
  infoBlock.style.borderTop = "1px solid #666";
  infoBlock.style.paddingTop = "8px";
  infoBlock.style.fontSize = "13px";
  infoBlock.innerHTML = `
    <div>Birds: <span id="birdCount">0</span></div>
  `;
  panel.appendChild(infoBlock);

  document.body.appendChild(panel);
}

export function updateSimPanel({ birdCount }) {
  const countEl = document.getElementById("birdCount");
  if (countEl) {
    countEl.textContent = birdCount;
  }
}

export function destroySimPanel() {
  if (panel) {
    panel.remove();
    panel = null;
    infoBlock = null;
  }
}
