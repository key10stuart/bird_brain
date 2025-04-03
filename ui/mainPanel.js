// ui/mainPanel.js
import { createPhysicsPanel, destroyPhysicsPanel } from "./physics_stuff.js";
import { createSimPanel, destroySimPanel } from "./sim_stuff.js";
import { createNeuralPanel, destroyNeuralPanel } from "./neural_net_stuff.js";
import { toggleDevEnv } from "../core/dev_env.js";

let currentPanel = null;

export function createMainPanel() {
  const panel = document.createElement("div");
  panel.id = "mainPanel";
  panel.style.position = "absolute";
  panel.style.top = "10px";
  panel.style.left = "10px";
  panel.style.background = "rgba(0,0,0,0.8)";
  panel.style.padding = "10px";
  panel.style.color = "white";
  panel.style.fontFamily = "monospace";
  panel.style.zIndex = "10000";

  const buttons = [
    { name: "Physics", create: createPhysicsPanel, destroy: destroyPhysicsPanel },
    { name: "Sim", create: createSimPanel, destroy: destroySimPanel },
    { name: "Neural", create: createNeuralPanel, destroy: destroyNeuralPanel },
  ];

  buttons.forEach(({ name, create, destroy }) => {
    const btn = document.createElement("button");
    btn.textContent = name;
    btn.style.display = "block";
    btn.style.marginBottom = "5px";

    btn.onclick = () => {
      if (currentPanel === name) {
        destroy();
        currentPanel = null;
      } else {
        if (currentPanel) {
          const prev = buttons.find(b => b.name === currentPanel);
          if (prev?.destroy) prev.destroy();
        }
        create();
        currentPanel = name;
      }
    };

    panel.appendChild(btn);
  });

  // Static Dev Env toggle button
  const devBtn = document.createElement("button");
  devBtn.textContent = "Dev Env";
  devBtn.style.display = "block";
  devBtn.style.marginTop = "10px";
  devBtn.style.background = "#444";

  devBtn.onclick = () => {
    toggleDevEnv();
  };

  panel.appendChild(devBtn);
  document.body.appendChild(panel);
}
