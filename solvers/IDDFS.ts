import Solution from "../models/Solution";
import State, { OpCodes } from "../models/State";
import Tree from "../models/Tree";

interface DLSResult {
    node: Tree | null;
    visitCount: number;
}

/**
 * Giải bài toán 8-puzzle sử dụng thuật toán Tìm kiếm sâu dần (IDDFS).
 * 
 * Thuật toán này kết hợp ưu điểm của DFS (tiết kiệm bộ nhớ) và BFS (tìm lời giải tối ưu).
 * Nó lặp lại việc tìm kiếm theo chiều sâu với giới hạn độ sâu tăng dần.
 * 
 * @param startingState Trạng thái bắt đầu của bài toán.
 * @param maxDepth Giới hạn độ sâu tối đa để tìm kiếm (mặc định là 50).
 * @returns Đối tượng Solution chứa kết quả tìm kiếm, tổng số lượt duyệt và thời gian thực thi.
 */
export default function solveWithIDDFS(startingState: State, maxDepth: number = 50): Solution {
    let startTime = Date.now();
    let totalVisitCount = 0;
    if (!startingState.isSolvable()) {
        return new Solution(null, 0, Date.now() - startTime);
    }
    for (let limit = 0; limit <= maxDepth; limit++) {
        let root = new Tree(null, startingState, null);
        let result = depthLimitedSearch(root, limit);
        totalVisitCount += result.visitCount;
        if (result.node) {
            let timeTaken = Date.now() - startTime;
            return new Solution(result.node, totalVisitCount, timeTaken);
        }
    }
    let timeTaken = Date.now() - startTime;
    return new Solution(null, totalVisitCount, timeTaken);
}

/**
 * Hàm Tìm kiếm giới hạn độ sâu (Depth-Limited Search - DLS) sử dụng vòng lặp và Stack.
 * 
 * @param root Nút gốc cho lần tìm kiếm này.
 * @param limit Giới hạn độ sâu tối đa cho lần tìm kiếm này.
 * @returns Object chứa nút đích (nếu tìm thấy) và tổng số trạng thái đã duyệt.
 */
function depthLimitedSearch(root: Tree, limit: number): DLSResult {
    let visitCount = 0;
    let stack: { node: Tree; currentLimit: number }[] = [{ node: root, currentLimit: limit }];
    while (stack.length > 0) {
        let { node, currentLimit } = stack.pop()!;
        visitCount++;
        let currentState = node.getState();
        if (currentState.isFinish()) {
            return {
                node: node,
                visitCount: visitCount
            };
        }
        if (currentLimit > 0) {
            let moves = [OpCodes.Up, OpCodes.Down, OpCodes.Left, OpCodes.Right];
            for (let op of moves) {
                let nextState = new State(currentState);
                nextState.move(op);
                if (nextState.equals(currentState)) {
                    continue;
                }
                if (node.isTraversedState(nextState)) {
                    continue;
                }
                let nextNode = new Tree(node, nextState, op);
                stack.push({ node: nextNode, currentLimit: currentLimit - 1 });
            }
        }
    }
    return {
        node: null,
        visitCount: visitCount
    };
}
