import Solution from "../models/Solution";
import State, { OpCodes } from "../models/State";
import Tree from "../models/Tree";

/**
 * Giải bài toán 8-puzzle sử dụng thuật toán Tìm kiếm theo chiều rộng (BFS).
 * BFS đảm bảo tìm thấy đường đi ngắn nhất (tối ưu) cho bài toán.
 * 
 * @param startingState Trạng thái bắt đầu của bài toán.
 * @param maxVisitCount Giới hạn số lượng nút tối đa được phép duyệt (mặc định là 20,000).
 * @returns Đối tượng Solution chứa kết quả tìm kiếm.
 */
export default function solveWithBFS(startingState: State, maxVisitCount: number = 20000): Solution {
  const startTime = Date.now();
  if (!startingState.isSolvable()) {
    return new Solution(null, 0, Date.now() - startTime);
  }
  const root = new Tree(null, startingState, null);
  let visitCount = 0;
  const queue: Tree[] = [root];
  const visited = new Set<number>([root.getState().getTiles()]);
  const moves = [OpCodes.Up, OpCodes.Down, OpCodes.Left, OpCodes.Right];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    visitCount++;
    const currentState = node.getState();
    if (currentState.isFinish()) {
      return new Solution(node, visitCount, Date.now() - startTime);
    }
    if (visitCount >= maxVisitCount) {
      break;
    }
    for (const op of moves) {
      const nextState = new State(currentState);
      nextState.move(op);
      if (nextState.equals(currentState)) {
        continue;
      };
      const tiles = nextState.getTiles();
      if (!visited.has(tiles)) {
        visited.add(tiles);
        const nextNode = new Tree(node, nextState, op);
        queue.push(nextNode);
      }
    }
  }
  return new Solution(null, visitCount, Date.now() - startTime);
}
