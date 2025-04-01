const INPUT_SIZE = 8;      // dx, dy, vx, vy, altitude, energy, distanceToBerry, bias
const HIDDEN_SIZE = 8;
const OUTPUT_SIZE = 4;     // walk, flap, glide, pause

export function createHardCodedNN() {
  const nn = {
    w1: Array.from({ length: HIDDEN_SIZE }, () => Array(INPUT_SIZE).fill(0)),
    b1: Array(HIDDEN_SIZE).fill(0),
    w2: Array.from({ length: OUTPUT_SIZE }, () => Array(HIDDEN_SIZE).fill(0)),
    b2: Array(OUTPUT_SIZE).fill(0),
  };

  // Hidden 0: Flap at large distance (mild)
  nn.w1[0][6] = 2.0;
  nn.b1[0] = 0.2;

  // Hidden 1: Glide at medium distance
  nn.w1[1][6] = 1.2;
  nn.b1[1] = -1.2;

  // Hidden 2: Walk at short distance
  nn.w1[2][6] = -1.5;
  nn.b1[2] = 2.0;

  // Hidden 3: Pause when energy is low
  nn.w1[3][5] = -4.0;
  nn.b1[3] = 2.0;

  // Hidden 4: Bias-only neuron for random-ish pause chance
  nn.b1[4] = 0.6 + Math.random();

  // Output layer: [walk, flap, glide, pause]
  nn.w2[0][2] = 3.0;  // walk ← H2
  nn.w2[1][0] = 3.0;  // flap ← H0
  nn.w2[2][1] = 3.0;  // glide ← H1
  nn.w2[3][3] = 4.0;  // pause ← H3 (energy trigger)
  nn.w2[3][4] = 2.0;  // pause ← H4 (bias-based)

  return nn;
}

export function forward(nn, input) {
  const hidden = nn.w1.map((row, i) =>
    relu(dot(row, input) + nn.b1[i])
  );
  return nn.w2.map((row, i) =>
    sigmoid(dot(row, hidden) + nn.b2[i])
  );
}

// Internal helpers
function dot(a, b) {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

function relu(x) {
  return Math.max(0, x);
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}
