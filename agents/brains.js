// agents/brains.js

// Create a simple 3-input → 4-hidden → 3-output feedforward NN
export function createRandomNN() {
    return {
      w1: [randWeights(5), randWeights(5), randWeights(5), randWeights(5)], // 5 inputs now
      b1: [0, 0, 0, 0],
      w2: [randWeights(4), randWeights(4), randWeights(4)], // 3 outputs
      b2: [0, 0, 0]
    };
  }  
  
  // Run a forward pass through the NN given input [x, y, bias?]
  export function forward(nn, input) {
    const hidden = nn.w1.map((row, i) =>
      relu(dot(row, input) + nn.b1[i])
    );
    return nn.w2.map((row, i) =>
      sigmoid(dot(row, hidden) + nn.b2[i])
    );
  }
  
  // --- Utility Functions ---
  
  function randWeights(n) {
    return Array.from({ length: n }, () => Math.random() * 2 - 1);
  }
  
  function dot(a, b) {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
  }
  
  function relu(x) {
    return Math.max(0, x);
  }
  
  function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  