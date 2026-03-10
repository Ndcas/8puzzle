const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Goal state
const GOAL = [1, 2, 3, 4, 5, 6, 7, 8, 0];

// Directions for moves
const DIRECTIONS = {
  up: -3,
  down: 3,
  left: -1,
  right: 1
};

// Check if state is goal
function isGoal(state) {
  return state.every((val, idx) => val === GOAL[idx]);
}

// Get possible moves from current state
function getMoves(state) {
  const zeroIndex = state.indexOf(0);
  const row = Math.floor(zeroIndex / 3);
  const col = zeroIndex % 3;
  const moves = [];

  if (row > 0) moves.push('up');
  if (row < 2) moves.push('down');
  if (col > 0) moves.push('left');
  if (col < 2) moves.push('right');

  return moves;
}

// Apply move to state
function applyMove(state, move) {
  const newState = [...state];
  const zeroIndex = newState.indexOf(0);
  const swapIndex = zeroIndex + DIRECTIONS[move];
  [newState[zeroIndex], newState[swapIndex]] = [newState[swapIndex], newState[zeroIndex]];
  return newState;
}

// DFS function
function dfs(currentState, visited, path, maxDepth = 20) {
  if (isGoal(currentState)) {
    return path;
  }

  if (path.length >= maxDepth) {
    return null; // Prevent infinite recursion
  }

  const stateKey = currentState.join(',');
  if (visited.has(stateKey)) {
    return null;
  }
  visited.add(stateKey);

  const moves = getMoves(currentState);
  for (const move of moves) {
    const newState = applyMove(currentState, move);
    const result = dfs(newState, visited, [...path, move], maxDepth);
    if (result) {
      return result;
    }
  }

  return null;
}

// API endpoint
app.post('/solve', (req, res) => {
  const { puzzle } = req.body;
  if (!puzzle || !Array.isArray(puzzle) || puzzle.length !== 9) {
    return res.status(400).json({ error: 'Invalid puzzle state' });
  }

  const visited = new Set();
  const solution = dfs(puzzle, visited, []);

  if (solution) {
    res.json({ solution, steps: solution.length });
  } else {
    res.json({ solution: null, message: 'No solution found within depth limit' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});