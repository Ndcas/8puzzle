import Solution from "../models/Solution";
import State, { OpCodes } from "../models/State";
import Tree from "../models/Tree";

export default function solveWithBFS(startingState: State): Solution {
  const startTime = Date.now();

  if (!startingState.isSolvable()) {
    return new Solution(null, 0, Date.now() - startTime);
  }

  const root = new Tree(null, startingState, null);
  const result = bfs(root);

  return new Solution(result.node, result.visitCount, Date.now() - startTime);
}

interface BFSResult {
  node: Tree | null;
  visitCount: number;
}

const MOVES = [OpCodes.Up, OpCodes.Down, OpCodes.Left, OpCodes.Right] as const;

function bfs(root: Tree): BFSResult {

  const queue: Tree[] = [root];
  let visitCount = 0;

  while (queue.length > 0) {

    const node = queue.shift()!;
    visitCount++;

    const currentState = node.getState();

    if (currentState.isFinish()) {
      return { node, visitCount };
    }

    for (const op of MOVES) {

      const nextState = new State(currentState);
      nextState.move(op);

      if (nextState.equals(currentState))   continue;
      if (node.isTraversedState(nextState)) continue;

      const nextNode = new Tree(node, nextState, op);

      queue.push(nextNode);
    }
  }

  return { node: null, visitCount };
}