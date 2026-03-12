import Solution from "../models/Solution";
import State, { OpCodes } from "../models/State";
import Tree from "../models/Tree";
import PriorityQueue from "../models/PriorityQueue";

function comparator(a: Tree, b: Tree): number {
  const fA = a.getDepth() + (a.getState().getManhattanH() || 0);
  const fB = b.getDepth() + (b.getState().getManhattanH() || 0);
  if (fA == fB) {
    return (a.getState().getManhattanH() || 0) - (b.getState().getManhattanH() || 0);
  }
  return fA - fB;
}

/**
 * Giải bài toán 8-puzzle sử dụng thuật toán A* (A-star).
 * A* sử dụng hàm đánh giá f(n) = g(n) + h(n) để tìm lời giải tối ưu.
 * Trong đó:
 * - g(n): Chi phí đường đi từ nút gốc đến nút hiện tại (độ sâu).
 * - h(n): Ước lượng chi phí từ nút hiện tại đến đích (Manhattan Distance).
 * 
 * @param startingState Trạng thái bắt đầu của bài toán.
 * @param maxVisitCount Giới hạn số trạng thái duyệt tối đa (mặc định là 20,000).
 * @returns Đối tượng Solution chứa kết quả tìm kiếm.
 */
export default function solveWithAStar(startingState: State, maxVisitCount: number = 20000): Solution {
  let startTime = Date.now();
  if (!startingState.isSolvable()) {
    return new Solution(null, 0, Date.now() - startTime);
  }
  const root = new Tree(null, startingState, null);
  let visitCount = 0;
  const open = new PriorityQueue<Tree>(comparator);
  const gScore = new Map<number, number>();
  open.push(root);
  gScore.set(root.getState().getTiles(), 0);
  const moves = [OpCodes.Up, OpCodes.Down, OpCodes.Left, OpCodes.Right];
  while (!open.isEmpty()) {
    const node = open.pop()!;
    visitCount++;
    const currentState = node.getState();
    if (currentState.isFinish()) {
      return new Solution(node, visitCount, Date.now() - startTime);
    }
    if (visitCount >= maxVisitCount) {
      break;
    }
    const currentG = node.getDepth();
    for (const op of moves) {
      const nextState = new State(currentState);
      nextState.move(op);
      if (nextState.equals(currentState)) {
        continue;
      }
      const nextG = currentG + 1;
      const key = nextState.getTiles();
      if (!gScore.has(key) || nextG < gScore.get(key)!) {
        gScore.set(key, nextG);
        const nextNode = new Tree(node, nextState, op);
        open.push(nextNode);
      }
    }
  }
  return new Solution(null, visitCount, Date.now() - startTime);
}