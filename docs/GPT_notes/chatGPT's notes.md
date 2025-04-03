# 🐦 Bird Simulation Architecture – Phase 2 (Cognitive Layering, Genome-Based Agents)

Welcome to the evolving design of a generative, cognitively driven 2D bird ecosystem.

This document outlines the key architecture, design philosophy, and current systems underpinning the bird simulation — a modular, extensible, and emergent simulation built with JavaScript and HTML Canvas.

---

## 🔧 Project Overview

This is a real-time simulation of autonomous bird agents:

- Driven by small neural networks
- Evolving via heritable genomes
- Operating in a resource-rich world
- Expressing behavior via modular cognition

---

## 🧠 Cognitive Layer Design

| Layer          | Purpose                            | Update Frequency | Output                                 |
|----------------|------------------------------------|------------------|-----------------------------------------|
| **Attention**  | Choose what to focus on            | ~5 seconds       | `attentionTarget`: x, y, type           |
| **Destination**| Set the target location to pursue  | ~1 second        | `destination`: x, y                     |
| **Motor**      | Decide action and movement vector  | Every frame      | actionIndex (flap, glide, etc.), glide duration |

---

## 🧬 Genome & Evolution

Each bird is constructed from a `genome`:
- Contains neural weights (`motorNet`, `attentionNet`, etc.)
- Will later hold physical traits (e.g. flap strength, turn speed)
- Passed to offspring via mutation logic

The genome lives in:
- `/evolution/genetics.js` – handles creation, mutation, inheritance
- `/entities/birdBuilder.js` – turns genome into a working bird

Reproduction is triggered automatically when a bird’s energy hits 100.

---

## 🐤 `NPCBird.js` Lifecycle

Each non-player bird maintains:
- Timers for brain layer updates
- Rotational facing (`angle`)
- Cooldowns for flapping, feeding, collisions
- Layered neural networks
- Memory of attention & destination

The bird's `update()` function manages:
1. Timer-driven brain updates
2. Smooth rotation toward `destination`
3. Motor decision passed to physics engine
4. Reproduction trigger
5. Drawing the correct sprite

---

## 💨 Physics System

Handled entirely in `birdPhysics.js`:

- 🦶 **Walk** and 🕊️ **Flap** use `Math.cos(angle)` thrust
- 🪂 **Glide** uses smooth vector blending
- 🎯 Directional updates tied to actual `angle`, not just resource vector
- ✨ Collisions and bounce physics between birds
- ❌ No teleportation; movement emerges from rotation + thrust

---

## 🧭 Game Loop

The master loop (`core/gameLoop.js`) handles:
- Resource drawing & updates
- Bird updates (NPC + player)
- Passive spawning via `spawnLogic.js`
- Simple debug overlays
- Bird count display

---

## 📂 File Architecture

/core 
└── gameLoop.js ← simulation loop 
└── birdPhysics.js ← physics + motion

/entities 
└── NPCBird.js ← brain + body lifecycle 
└── birdBuilder.js ← build birds from genomes 
└── spawnLogic.js ← spawning + reproduction

/agents 
└── runNN.js ← forward pass engine 
└── bird_brains/ 
	└── motorCortex.js ← motor logic 
	└── all_you_need.js ← attention logic

/evolution 
└── genetics.js ← genome structure + mutation

/draw 
└── drawBird.js ← sprite drawing logic



---

## 🎯 Design Principles

| Principle               | Description |
|-------------------------|-------------|
| **Modularity**          | Each function lives in its own file (SRP) |
| **Layered Cognition**   | Brains think at different rates — like real animals |
| **Directional Movement**| Facing angle governs thrust and sprite |
| **Emergence**           | No hardcoded behavior — NNs + physics drive decisions |
| **Evolvability**        | Brains mutate and breed from `genome` |
| **Visual Transparency** | Debug lines, logs, and overlays help understand intent |

---

## 🧪 Notable Emergent Behaviors (so far)

- Spiraling birds as they adjust attention while midflight
- Backwards walking resolved by angle-based walking logic
- Birds who starve due to inaction — behaviorally distinct from others
- Evolution-driven divergence in movement & feeding patterns

---

## 🛣️ Roadmap: What's Next

- Add **physical trait expression** to genomes (e.g. flap strength, turn speed)
- Create **predator species** and **prey avoidance networks**
- Add **social behavior modules** (flocking, attraction, aggression)
- Build a **memory system** (short-term danger or success recollection)
- Track and visualize **lineages** and **evolutionary drift**
- Expose live **heatmaps of neural activation** (debug UI overlay)
- Add **environmental obstacles**, weather, and seasons

---

## ✨ Reflections

This architecture is designed to simulate not just motion, but **cognition under resource constraints** — where every action has cost, and brains must evolve to match an environment they’re not guaranteed to understand.

The fact that spiraling and idling have emerged — without being scripted — is a sign that the system has reached **nontrivial behavioral space**. And that means... it’s alive. 👁️
