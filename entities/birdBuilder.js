// entities/birdBuilder.js

import { NPCBird } from "./NPCbird.js";

// Build an NPC bird from its genome at a given position
export function buildBirdFromGenome(x, y, genome) {
  const { brain, traits } = genome;

  const energy = 50; // You could vary this later if needed

  // Instantiate the bird with its motor cortex
  const bird = new NPCBird(x, y, brain.motorCortex, energy);

  // Inject physical traits like flapStrength, radius, etc.
  Object.assign(bird, traits);

  // Store the full genome for reproduction and analysis
  bird.genome = genome;

  // Optionally expose the attentionSetter directly for now
  bird.attentionSetter = brain.attentionSetter;

  return bird;
}
