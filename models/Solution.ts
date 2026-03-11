import Tree from "./Tree";

export default class Solution {
    public readonly tree: Tree | null;
    public readonly visitCount: number;
    public readonly timeTaken: number;

    /**
     * Khởi tạo một đối tượng Solution chứa kết quả của thuật toán tìm kiếm.
     * @param tree Nút lá chứa trạng thái đích (null nếu không tìm thấy lời giải).
     * @param visitCount Tổng số lượt duyệt trạng thái.
     * @param timeTaken Thời gian thực thi thuật toán (đơn vị: ms).
     */
    public constructor(tree: Tree | null, visitCount: number, timeTaken: number) {
        this.tree = tree;
        this.visitCount = visitCount;
        this.timeTaken = timeTaken;
    }
}