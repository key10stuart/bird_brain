// agents/runNN.js

// Dot product of two vectors
export function dot(a, b) {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
  }
  
  // ReLU activation
  export function relu(x) {
    return Math.max(0, x);
  }
  
  // Sigmoid activation
  export function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  // Generic 2-layer NN forward pass
  export function forward(net, input) {
    const hidden = net.w1.map((row, i) =>
      relu(dot(row, input) + net.b1[i])
    );
    return net.w2.map((row, i) =>
      sigmoid(dot(row, hidden) + net.b2[i])
    );
  }
  