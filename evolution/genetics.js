// evolution/genetics.js

import { createDefaultMotorNet, mutateMotorNet } from "../agents/bird_brains/motorCortex.js";
import { createDefaultAttentionNet, mutateAttentionNet } from "../agents/bird_brains/all_you_need.js";

const DEFAULT_TRAITS = {
  flapStrength: 1.0,
  glideAffect: 1.0,
  radius: 10,
  bodyHeight: 7,
  spriteType: "default",
};

export function createDefaultGenome() {
  return {
    brain: {
      motorCortex: createDefaultMotorNet(),
      attentionSetter: createDefaultAttentionNet(),
    },
    traits: { ...DEFAULT_TRAITS },
    generation: 1,
    ancestor: null,
  };
}

export function mutateGenome(genome, config = {}) {
  const mutated = structuredClone(genome);

  // Mutate brain modules
  mutated.brain.motorCortex = mutateMotorNet(mutated.brain.motorCortex, config.motorMutation ?? 0.1);
  mutated.brain.attentionSetter = mutateAttentionNet(mutated.brain.attentionSetter, config.attnMutation ?? 0.1);

  // Mutate traits
  if (Math.random() < 0.1) mutated.traits.flapStrength += (Math.random() - 0.5) * 0.2;
  if (Math.random() < 0.1) mutated.traits.glideAffect += (Math.random() - 0.5) * 0.2;
  if (Math.random() < 0.1) mutated.traits.radius += (Math.random() - 0.5) * 0.5;

  // Mutate sprite type
  if (Math.random() < 0.05) {
    const sprites = ["default", "stripey", "dotty", "bighead"];
    mutated.traits.spriteType = sprites[Math.floor(Math.random() * sprites.length)];
  }

  mutated.generation = (genome.generation ?? 1) + 1;
  mutated.ancestor = config.includeAncestry ? genome : null;

  return mutated;
}
