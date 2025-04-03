// agents/bird_brains/all_you_need.js

import { forward, relu, sigmoid, dot } from "../runNN.js"; // core NN math utils

const INPUT_SIZE = 5; // dx, dy, dist, energy, type
const HIDDEN_SIZE = 6;
const OUTPUT_SIZE = 1; // probability to attend

export function createDefaultAttentionNet() {
  return {
    w1: Array.from({ length: HIDDEN_SIZE }, () => Array(INPUT_SIZE).fill(0).map(() => Math.random() - 0.5)),
    b1: Array(HIDDEN_SIZE).fill(0).map(() => Math.random() - 0.5),
    w2: Array.from({ length: OUTPUT_SIZE }, () => Array(HIDDEN_SIZE).fill(0).map(() => Math.random() - 0.5)),
    b2: Array(OUTPUT_SIZE).fill(0),
  };
}

export function mutateAttentionNet(net, rate = 0.1, magnitude = 0.5) {
  const mutated = JSON.parse(JSON.stringify(net));

  for (const layer of ["w1", "w2"]) {
    mutated[layer] = mutated[layer].map(row =>
      row.map(w => (Math.random() < rate ? w + (Math.random() * 2 - 1) * magnitude : w))
    );
  }
  return mutated;
}

export function forwardAttentionNet(net, input) {
  const hidden = net.w1.map((row, i) => relu(dot(row, input) + net.b1[i]));
  const output = sigmoid(dot(net.w2[0], hidden) + net.b2[0]);
  return output; // Probability between 0 and 1
}