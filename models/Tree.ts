import State, { OpCodes } from "./State";

export default class Tree {
    private parent: Tree | null;
    private state: State;
    private opCode: OpCodes | null;

    /**
     * Khởi tạo một nút mới trong cây tìm kiếm.
     * @param parent Nút cha của nút hiện tại (null nếu là nút gốc).
     * @param state Trạng thái của bài toán tại nút này.
     * @param opCode Mã lệnh di chuyển dẫn đến trạng thái này từ nút cha.
     */
    public constructor(parent: Tree | null, state: State, opCode: OpCodes | null) {
        this.parent = parent;
        this.state = state;
        this.opCode = opCode;
    }

    /**
     * Lấy nút cha của nút hiện tại.
     * @returns Trả về Tree hoặc null nếu đây là nút gốc.
     */
    public getParent(): Tree | null {
        return this.parent;
    }

    /**
     * Lấy trạng thái bài toán được lưu trữ tại nút này.
     * @returns Đối tượng State.
     */
    public getState(): State {
        return this.state;
    }

    /**
     * Lấy mã lệnh di chuyển dẫn đến nút này.
     * @returns Trả về OpCodes hoặc null nếu đây là nút gốc.
     */
    public getOpCode(): OpCodes | null {
        return this.opCode;
    }

    /**
     * Lấy danh sách tất cả các bước di chuyển từ nút gốc đến nút hiện tại.
     * @returns Mảng các OpCodes theo đúng thứ tự thực hiện.
     */
    public getOpCodes(): OpCodes[] {
        let result = [];
        let node: Tree | null = this;
        while (node != null) {
            if (node.opCode != null) {
                result.push(node.opCode);
            }
            node = node.parent;
        }
        return result.reverse();
    }

    /**
     * Kiểm tra xem một trạng thái đã tồn tại trên đường đi từ gốc đến nút hiện tại chưa.
     * Dùng để tránh lặp vòng (cycle) trong các thuật toán như DFS/IDS mà không tốn nhiều bộ nhớ.
     * @param state Trạng thái cần kiểm tra.
     * @returns True nếu trạng thái đã tồn tại, ngược lại là False.
     */
    public isTraversedState(state: State): boolean {
        let node: Tree | null = this;
        while (node != null) {
            if (node.state.equals(state)) {
                return true;
            }
            node = node.parent;
        }
        return false;
    }
}