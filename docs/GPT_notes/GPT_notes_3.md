# 🐦 Bird Sim — Phase 2 Architecture Updates (April 2025)

This document outlines the major architectural updates made during the **Phase 2 refactor** of the Bird Simulation project. These changes improve modularity, enable scalable rendering and debugging, and lay a strong foundation for expanding neural net behaviors and dev tooling.

---

## ✅ Summary of Major Changes

### 1. **Rendering System Modularization**

We moved all rendering logic into a dedicated `draw/` folder, making visual output a pure and isolated concern.

- `renderScene(ctx, { player, npcBirds })` is now the only render entry point.
    
- Each layer is drawn in order: `drawMap`, `drawResources`, `drawBirds`, and `drawHUD` or overlays.
    
- `drawBirds()` loops through all birds and delegates to `drawFlyingBird()` or `drawLandedBird()` depending on physics state.
    

> **File Created/Updated**:
> 
> - `draw/renderScene.js`
>     
> - `draw/drawBirds.js`
>     
> - `draw/drawBird.js`
>     

---

### 2. **PlayerBird Refactor for Duck Typing**

Previously, `PlayerBird` wrapped a `BaseBird` and wasn’t compatible with rendering logic expecting a flat `Bird` object.

We added passthrough getters to `PlayerBird`:

get x() { return this.birdBody.x; }
get angle() { return this.birdBody.angle; }
// etc.

This makes the player bird fully compatible with any system expecting a `NPCBird`-like structure.

> **File Updated**: `entities/PlayerBird.js`

### 3. **Live Simulation Stats in Sim Panel**

Instead of drawing stats on canvas (e.g. “Birds: 13”), we now inject them into the DOM using the right-hand `simPanel`.

- `createSimPanel()` now includes a live bird count block.
    
- `updateSimPanel({ birdCount })` updates the DOM every frame.
    
- This decouples game state from canvas rendering and allows better UI extension.

// Called in gameLoop.js:
updateSimPanel({ birdCount: npcBirds.length });

**File Updated**: `ui/sim_stuff.js`


🧱 Architecture Snapshot

main.js
├── gameLoop.js
│   ├── updateTime(), getDelta()
│   ├── updateResources()
│   ├── PlayerBird.update()
│   ├── NPCBird.update()
│   ├── passiveBirdSpawner()
│   ├── updateSimPanel()
│   └── renderScene()
│
draw/
├── renderScene.js         # Composes rendering layers
├── drawMap.js             # Background + dev mode
├── drawResources.js       # Berries, seeds, bugs
├── drawBirds.js           # Loops through birds
└── drawBird.js            # Handles sprite drawing

entities/
├── PlayerBird.js          # Now duck-typed
├── NPCBird.js             # Uses neural logic + birdPhysics
├── Resources.js           # Spawning + collision
└── birdBuilder.js         # Genome-to-bird

core/
├── gameLoop.js
├── timeControl.js
└── birdPhysics.js         # Applies flap, glide, dive, landing

## 💡 Next Steps (Suggestions)

- Add average bird energy or resource count to `simPanel`
    
- Support sprite variants via `settings.spriteVariant`
    
- Add dev draw stack for thought bubble overlays
    
- Expand neural logging (e.g. display motor outputs)