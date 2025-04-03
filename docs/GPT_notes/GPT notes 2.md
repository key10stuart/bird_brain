**Bird Simulator Dev Notes: Time Control & UI Panels (April 2025)**

---

### 🕒 TimeControl Integration

**Purpose:** Unify and centralize all time-related calculations across the game loop, resource logic, bird physics, and neural network updates. This enables adjustable simulation speed without needing to refactor logic across dozens of files.

**Implementation Highlights:**

- Created `core/timeControl.js` to track raw `delta` (time since last frame) and apply `simSpeed` as a multiplier.
    
- Functions:
    
    - `updateTime()` is called once per frame.
        
    - `getDelta()` returns raw delta in ms.
        
    - `getScaledDelta()` returns delta × `simSpeed`.
        

**Systems Updated to Use TimeControl:**

- `gameLoop.js`: passes correct delta (scaled vs unscaled) to all systems
    
- `NPCBird.js`: bird thinking, feeding, decision-making now respect time scaling
    
- `birdPhysics.js`: upcoming updates to scale motion and gravity with delta
    
- `resources.js`: spawn rate now scales with `simSpeed` properly
    
- `spawnLogic.js`: passive spawning system now runs in real time and scales with `simSpeed`
    

---

### 📏 Simulation Panel System

**Goal:** Create an organized, toggleable UI for debugging and tuning values during runtime.

**Structure:**

- `mainPanel.js`: left-aligned master panel to toggle visibility of optional panels
    
- Optional panels (only one shown at a time, right-aligned):
    
    - `physics_stuff.js`: gravity, glide, speed, flap strength, etc
        
    - `sim_stuff.js`: resource and bird spawn rates, drain rate, max birds
        
    - `neural_net_stuff.js`: debug toggles for attention/destination drawing
        

**Functionality:**

- Main panel toggles show/hide of optional panels
    
- Selecting one optional panel auto-deselects others
    
- Debug settings modify values in the `settings.js` object directly
    

---

### ❌ Key Bugs Encountered & Resolved

#### ⚠️ Resource Spawn Too Fast

**Cause:** `resourceSpawnRate` was too high for new delta-scaled system (e.g., 5 meant 5 per second per bird frame update). **Fix:**

- Corrected accumulation logic using `delta * simSpeed`
    
- Tuned default spawn rate to `0.2` to equal ~1 spawn per second
    

#### ⚠️ Bird Flapping Broke After Refactor

**Cause:** A temporary optimization attempt skipped `updateBirdPhysics()` inside `NPCBird.js` **Fix:** Reverted to known working structure and reintroduced `updateBirdPhysics()` for all NPC birds

#### ⚠️ SimSpeed Not Affecting All Systems

**Cause:** Inconsistent application of `simSpeed` and scaled vs raw `delta` **Fix:** Swept all core systems to apply time scaling uniformly, including drain rate, spawn intervals, and timers

---

### ✅ Next Steps

-  Refactor `birdPhysics.js` to apply `delta` to velocity, gravity, and cooldowns
    
-  Centralize panel rendering to avoid duplication in multiple optional panels
    
-  Consider making resource spawning global instead of per-entity
    
-  Optionally log bird neural network decisions to file or dev console