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
 * Hàm Tìm kiếm giới hạn độ sâu (Depth-Limited Search - DLS).
 * 
 * Thực hiện tìm kiếm theo chiều sâu nhưng chỉ đến một mức độ sâu nhất định.
 * 
 * @param node Nút hiện tại trong cây tìm kiếm.
 * @param limit Giới hạn độ sâu còn lại.
 * @returns Object chứa nút đích (nếu tìm thấy) và số lượng trạng thái đã duyệt trong lần gọi này.
 */
function depthLimitedSearch(node: Tree, limit: number): DLSResult {
    let currentVisitCount = 1;
    let currentState = node.getState();
    if (currentState.isFinish()) {
        return {
            node: node,
            visitCount: currentVisitCount
        };
    }
    if (limit <= 0) {
        return {
            node: null,
            visitCount: currentVisitCount
        };
    }
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
        let result = depthLimitedSearch(nextNode, limit - 1);
        currentVisitCount += result.visitCount;
        if (result.node) {
            return {
                node: result.node,
                visitCount: currentVisitCount
            };
        }
    }
    return {
        node: null,
        visitCount: currentVisitCount
    };
}
