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
  let visitCount = 0;

  const MOVES = [OpCodes.Up, OpCodes.Down, OpCodes.Left, OpCodes.Right];

  const stack: { node: Tree; limit: number }[] = [
    { node: root, limit: Math.max(0, maxDepth) }
  ];

  while (stack.length > 0) {
    const { node, limit } = stack.pop()!;
    visitCount++;

    const currentState = node.getState();
    if (currentState.isFinish()) {
      return new Solution(node, visitCount, Date.now() - startTime);
    }

    if (limit > 0) {
      for (const op of MOVES) {
        const nextState = new State(currentState);
        nextState.move(op);

        if (nextState.equals(currentState)) continue;
        if (node.isTraversedState(nextState)) continue;

        const nextNode = new Tree(node, nextState, op);
        stack.push({ node: nextNode, limit: limit - 1 });
      }
    }
  }

  return new Solution(null, visitCount, Date.now() - startTime);
}