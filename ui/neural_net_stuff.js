// ui/neural_net_stuff.js
import { settings } from "../core/settings.js";

let panel;

export function createNeuralPanel() {
  if (panel) return;

  panel = document.createElement("div");
  panel.id = "neuralPanel";
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
  title.textContent = "🧠 Neural Net Debug";
  title.style.marginBottom = "10px";
  title.style.fontWeight = "bold";
  panel.appendChild(title);

  // Toggle for debugBird
  const toggleWrapper = document.createElement("div");
  const toggleLabel = document.createElement("label");
  toggleLabel.textContent = "debugBird: ";

  const toggleInput = document.createElement("input");
  toggleInput.type = "checkbox";

  if (settings.debugBird === undefined) {
    settings.debugBird = false;
  }

  toggleInput.checked = settings.debugBird;
  toggleInput.onchange = () => {
    settings.debugBird = toggleInput.checked;
  };

  toggleWrapper.appendChild(toggleLabel);
  toggleWrapper.appendChild(toggleInput);
  panel.appendChild(toggleWrapper);

  document.body.appendChild(panel);
}

export function destroyNeuralPanel() {
  if (panel) {
    panel.remove();
    panel = null;
  }
}
