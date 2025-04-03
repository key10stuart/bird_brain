## 🧪 Dev Mode + Tools Documentation

### 🗂️ File Changes & Features Added

---

### 1. **`dev_env.js` (core/dev_env.js)**

Purpose: Enables a toggleable "Dev Mode" with simplified rendering and debugging conditions.

**Key features:**

- `toggleDevEnv()`: Switches between main simulation and Dev Mode
    
- `startDevEnv()`: Initializes a solo `PlayerBird` with altered ground visuals
    
- `stopDevEnv()`: Returns to full sim and resets game state
    
- `renderDevScene(ctx, bird)`: Renders a white background, a single dev bird, and optional dev-only overlays
    
- `onDevExit(callback)`: Registers a reset callback for restoring sim state on exit
    

---

### 2. **`mainPanel.js` (ui/mainPanel.js)**

Purpose: Added a **"Dev Env"** button to the left-hand UI panel.

**Behavior:**

- Clicking "Dev Env" toggles dev mode on/off
    
- The rest of the UI remains available during dev mode
    
- Button text is static but toggles state
    

---

### 3. **`gameLoop.js` (core/gameLoop.js)**

Purpose: Integrated dev mode logic into the main game loop.

**Key changes:**

- Checks `isDevMode()` to determine whether to:
    
    - Run full sim updates (NPC birds, resources, etc.)
        
    - Or only update & render the dev bird
        
- Calls `renderDevScene()` when in Dev Mode
    
- Uses `resetGameState()` to reinitialize sim after exiting Dev Mode
    
- Uses `onDevExit()` to wire up state reset on dev exit
    

---

### 4. **`PlayerBird.js` (entities/PlayerBird.js)**

Purpose: Fixed read-only property issues and made `PlayerBird` duck-compatible.

**Key changes:**

- Added **setters** for: `x`, `y`, `altitude`, `angle`, `state`, `spriteMode`, `flapAnim`
    
- These allow Dev Mode code (and future tools) to directly manipulate `PlayerBird` properties
    

---

### 5. **`drawBirds.js` & `drawBird.js` (draw/)**

Purpose: Visually scaled the dev bird by lifting the **visual ground** (not actual physics ground).

**Enhancements:**

- Applied a `+1` altitude shift in Dev Mode to boost visual size
    
- Updated `drawLandedBird()` to:
    
    - Include scaling of body, wings, beak, and eyes
        
    - Maintain proper squash/stretch style
        
    - Avoid restoring canvas state too early
        

---

### 6. **`dev_viz.js` (draw/dev_viz.js)**

Purpose: Visual debug tool overlayed in Dev Mode to confirm mouse input.

**Features:**

- Draws a cartoon **mouse sprite** in the top-right corner of the canvas
    
- When mouse is pressed, shows a speech bubble with `"click"`
    
- Bubble disappears when mouse is released
    
- Uses `mouse.isDown` from `input.js` and `canvas.width` for positioning
    

---

### 7. **Settings**

- Adjusted `settings.flapCooldown` to change flap responsiveness in both sim and Dev Mode.
    
- Verified that the cooldown logic is handled centrally in `birdPhysics.js`.
    

---

## ✅ Summary

Your project now supports:

- A **fully functional Dev Mode** with minimal setup
    
- Toggleable state that isolates a `PlayerBird` in a white environment
    
- Fully working **debug visuals**
    
- No compromise to existing simulation systems
    
- Proper architectural separation between core systems and dev tools