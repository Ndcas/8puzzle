const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DIRECTIONS = {
  up: -3,
  down: 3,
  left: -1,
  right: 1
};

function isGoal(state, goal){
  return state.every((v,i)=>v===goal[i]);
}

function getMoves(state){
  const zero = state.indexOf(0);
  const row = Math.floor(zero/3);
  const col = zero % 3;

  const moves = [];
  if(row > 0) moves.push("up");
  if(row < 2) moves.push("down");
  if(col > 0) moves.push("left");
  if(col < 2) moves.push("right");

  return moves;
}

function applyMove(state, move){
  const newState = [...state];
  const zero = newState.indexOf(0);
  const swap = zero + DIRECTIONS[move];
  [newState[zero], newState[swap]] = [newState[swap], newState[zero]];
  return newState;
}

function dfs(state, goal, visited, path, maxDepth=25){
  if(isGoal(state, goal)){
    return path;
  }

  if(path.length > maxDepth){
    return null;
  }

  const key = state.join(",");
  if(visited.has(key)){
    return null;
  }

  visited.add(key);

  const moves = getMoves(state);
  for(const move of moves){
    const nextState = applyMove(state, move);
    const result = dfs(nextState, goal, visited, [...path, nextState], maxDepth);
    if(result) return result;
  }

  visited.delete(key);
  return null;
}

function isValidPuzzle(puzzle){
  if(!puzzle || puzzle.length !== 9) return false;
  const seen = new Set();
  for(const num of puzzle){
    if(num < 0 || num > 8 || seen.has(num)) return false;
    seen.add(num);
  }
  return seen.size === 9;
}

app.post("/solve",(req,res)=>{
  const { puzzle, goal } = req.body;

  // Dùng goal mặc định nếu không truyền vào
  const targetGoal = goal ?? [1,2,3,4,5,6,7,8,0];

  if(!isValidPuzzle(puzzle)){
    return res.status(400).json({
      message:"Invalid puzzle - must contain unique numbers 0-8"
    });
  }

  if(!isValidPuzzle(targetGoal)){
    return res.status(400).json({
      message:"Invalid goal - must contain unique numbers 0-8"
    });
  }

  let expandedNodes = 0;
  const visited = new Set();
  const start = Date.now();
  const solution = dfs(puzzle, targetGoal, visited, [puzzle]);
  const end = Date.now();

  if(solution){
    res.json({
      algorithm:"DFS",
      steps:solution,
      depth:solution.length-1,
      expandedNodes,
      time:(end-start)/1000
    });
  }else{
    res.json({ message:"No solution found" });
  }
});

app.listen(PORT,()=>{
  console.log(`Server running http://localhost:${PORT}`);
});