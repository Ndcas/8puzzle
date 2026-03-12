import Solution from "../models/Solution";
import State, { OpCodes } from "../models/State";
import Tree from "../models/Tree";

export default function solveWithAStar(
  startingState: State
): Solution {

  const startTime = Date.now();

  if (!startingState.isSolvable()) {
    return new Solution(null, 0, Date.now() - startTime);
  }

  const root = new Tree(null, startingState, null);

  const result = aStar(root);

  return new Solution(result.node, result.visitCount, Date.now() - startTime);
}

interface AStarResult {
  node: Tree | null;
  visitCount: number;
}

const MOVES = [OpCodes.Up, OpCodes.Down, OpCodes.Left, OpCodes.Right] as const;

function aStar(root: Tree): AStarResult {

  let visitCount = 0;

  const open: Tree[] = [root];
  const gScore = new Map<number, number>();

  gScore.set(root.getState().getTiles(), 0);

  while (open.length > 0) {

    // chọn node có f nhỏ nhất
    open.sort((a, b) => {
      const ga = gScore.get(a.getState().getTiles()) ?? Infinity;
      const gb = gScore.get(b.getState().getTiles()) ?? Infinity;

      const ha = a.getState().getManhattanH() ?? Infinity;
      const hb = b.getState().getManhattanH() ?? Infinity;

      const fa = ga + ha;
      const fb = gb + hb;

      return fa - fb;
    });

    const node = open.shift()!;
    visitCount++;

    const currentState = node.getState();

    if (currentState.isFinish()) {
      return { node, visitCount };
    }

    const currentG = gScore.get(currentState.getTiles()) ?? 0;

    for (const op of MOVES) {

      const nextState = new State(currentState);
      nextState.move(op);

      if (nextState.equals(currentState))   continue;
      if (node.isTraversedState(nextState)) continue;

      const nextG = currentG + 1;
      const key = nextState.getTiles();

      if (!gScore.has(key) || nextG < (gScore.get(key) ?? Infinity)) {

        gScore.set(key, nextG);

        const nextNode = new Tree(node, nextState, op);

        open.push(nextNode);
      }
    }
  }

  return { node: null, visitCount };
}