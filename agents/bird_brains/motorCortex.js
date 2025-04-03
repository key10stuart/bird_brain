// agents/bird_brains/motorCortex.js

import { relu, sigmoid, dot } from "../runNN.js";

const INPUT_SIZE = 11; // x, y, vx, vy, isFlying, dx/attn, dy/attn, dx/dest, dy/dest, energy, bias
const HIDDEN_SIZE = 8;
const OUTPUT_SIZE = 4; // flap, glide, doNothing, glideDuration

export function createDefaultMotorNet() {
  return {
    w1: Array.from({ length: HIDDEN_SIZE }, () => Array(INPUT_SIZE).fill(0).map(() => Math.random() - 0.5)),
    b1: Array(HIDDEN_SIZE).fill(0).map(() => Math.random() - 0.5),
    w2: Array.from({ length: OUTPUT_SIZE }, () => Array(HIDDEN_SIZE).fill(0).map(() => Math.random() - 0.5)),
    b2: Array(OUTPUT_SIZE).fill(0),
  };
}

export function mutateMotorNet(net, rate = 0.1, magnitude = 0.5) {
  const mutated = JSON.parse(JSON.stringify(net));

  for (const layer of ["w1", "w2"]) {
    mutated[layer] = mutated[layer].map(row =>
      row.map(w => (Math.random() < rate ? w + (Math.random() * 2 - 1) * magnitude : w))
    );
  }
  return mutated;
}

export function forwardMotorNet(net, input) {
  const hidden = net.w1.map((row, i) => relu(dot(row, input) + net.b1[i]));
  const output = net.w2.map((row, i) => sigmoid(dot(row, hidden) + net.b2[i]));
  return output; // [flap, glide, doNothing, glideDuration]
}