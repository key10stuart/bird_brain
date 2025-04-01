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
    { name: "resourceDrainRate", min: 0, max: 5, step: 0.1 },
    { name: "gravity", min: 0.01, max: 0.1, step: 0.001 },
    { name: "glide_grav", min: 0.5, max: 1, step: 0.01 },
    { name: "glide_affect", min: 1, max: 2, step: 0.01 },
    { name: "followSpeed", min: 1, max: 3, step: 0.1 },
    { name: "flapStrengthAir", min: 0.5, max: 1.5, step: 0.01 },
    { name: "flapStrengthGround", min: 0.5, max: 1.5, step: 0.01 },
    { name: "resourceSpawnRate", min: 0, max: 10, step: 1 },
  ];

  sliders.forEach(({ name, min, max, step }) => {
    if (settings[name] === undefined) settings[name] = min === 0 ? 1 : min;

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

  // Toggle: birdSpawnRate (0 or 1)
  const toggleWrapper = document.createElement("div");
  const toggleLabel = document.createElement("label");
  toggleLabel.textContent = "birdSpawn: ";

  const toggleInput = document.createElement("input");
  toggleInput.type = "checkbox";
  if (settings.birdSpawnRate === undefined) settings.birdSpawnRate = 0;
  toggleInput.checked = settings.birdSpawnRate === 1;
  toggleInput.onchange = () => {
    settings.birdSpawnRate = toggleInput.checked ? 1 : 0;
  };

  toggleWrapper.appendChild(toggleLabel);
  toggleWrapper.appendChild(toggleInput);
  debugPanel.appendChild(toggleWrapper);

  // Toggle: debugBird (on/off)
  const debugWrapper = document.createElement("div");
  const debugLabel = document.createElement("label");
  debugLabel.textContent = "debugBird: ";

  const debugInput = document.createElement("input");
  debugInput.type = "checkbox";
  if (settings.debugBird === undefined) settings.debugBird = false;
  debugInput.checked = settings.debugBird;
  debugInput.onchange = () => {
    settings.debugBird = debugInput.checked;
  };

  debugWrapper.appendChild(debugLabel);
  debugWrapper.appendChild(debugInput);
  debugPanel.appendChild(debugWrapper);
}
