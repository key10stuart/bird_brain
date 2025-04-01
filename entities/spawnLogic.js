// spawnLogic.js

function cloneBrain(brain) {
    return JSON.parse(JSON.stringify(brain));
  }
  
  function mutate(brain, rate = 0.1, magnitude = 0.5) {
    for (const layer of ['w1', 'w2']) {
      brain[layer] = brain[layer].map(row =>
        row.map(w => (Math.random() < rate ? w + (Math.random() * 2 - 1) * magnitude : w))
      );
    }
    return brain;
  }
  
  export function checkAndSpawn(bird, spawnBirdCallback) {
    if (bird.energy >= 100) {
      bird.energy = 50;
      const childBrain = mutate(cloneBrain(bird.brain));
      if (spawnBirdCallback) {
        const jitterX = (Math.random() - 0.5) * 30;
        const jitterY = (Math.random() - 0.5) * 30;
        spawnBirdCallback(bird.x + jitterX, bird.y + jitterY, childBrain);
      }
    }
  }