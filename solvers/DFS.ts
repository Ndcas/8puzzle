import Solution from "../models/Solution";
import State, { OpCodes } from "../models/State";
import Tree from "../models/Tree";

export default function solveWithDFS(
  startingState: State,
  maxDepth: number = 50
): Solution {
  const startTime = Date.now();

  if (!startingState.isSolvable()) {
    return new Solution(null, 0, Date.now() - startTime);
  }

  const root = new Tree(null, startingState, null);
  const result = dfs(root, Math.max(0, maxDepth));

  return new Solution(result.node, result.visitCount, Date.now() - startTime);
}

interface DFSResult {
  node: Tree | null;
  visitCount: number;
}

const MOVES = [OpCodes.Up, OpCodes.Down, OpCodes.Left, OpCodes.Right] as const;

function dfs(node: Tree, limit: number): DFSResult {
  let currentVisitCount = 1;
  const currentState = node.getState();

  if (currentState.isFinish()) return { node, visitCount: currentVisitCount };
  if (limit <= 0)              return { node: null, visitCount: currentVisitCount };

  for (const op of MOVES) {
    const nextState = new State(currentState);
    nextState.move(op);

    if (nextState.equals(currentState))   continue;
    if (node.isTraversedState(nextState)) continue;

    const nextNode = new Tree(node, nextState, op);
    const result   = dfs(nextNode, limit - 1);

    currentVisitCount += result.visitCount;

    if (result.node) return { node: result.node, visitCount: currentVisitCount };
  }

  return { node: null, visitCount: currentVisitCount };
}