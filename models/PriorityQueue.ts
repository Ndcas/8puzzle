export default class PriorityQueue<T> {
    private heap: T[];
    private comparator: (a: T, b: T) => number;

    /**
     * Khởi tạo Priority Queue.
     * @param comparator Hàm so sánh (a, b) => number. 
     * Nếu kết quả < 0, a có ưu tiên cao hơn b (Min-Heap).
     */
    constructor(comparator: (a: T, b: T) => number) {
        this.heap = [];
        this.comparator = comparator;
    }

    /**
     * Thêm một phần tử vào hàng đợi.
     * Độ phức tạp: O(log n).
     * @param element Phần tử cần thêm.
     */
    public push(element: T): void {
        this.heap.push(element);
        this.siftUp(this.heap.length - 1);
    }

    /**
     * Lấy và xóa phần tử có ưu tiên cao nhất ra khỏi hàng đợi.
     * Độ phức tạp: O(log n).
     * @returns Phần tử có ưu tiên cao nhất hoặc undefined nếu hàng đợi trống.
     */
    public pop(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        const top = this.heap[0];
        const last = this.heap.pop()!;
        if (!this.isEmpty()) {
            this.heap[0] = last;
            this.siftDown(0);
        }
        return top;
    }

    /**
     * Xem phần tử có ưu tiên cao nhất mà không xóa nó.
     * @returns Phần tử đầu hàng đợi.
     */
    public peek(): T | undefined {
        return this.heap[0];
    }

    /**
     * Kiểm tra hàng đợi có trống hay không.
     */
    public isEmpty(): boolean {
        return this.heap.length == 0;
    }

    /**
     * Lấy số lượng phần tử hiện có trong hàng đợi.
     */
    public size(): number {
        return this.heap.length;
    }

    /**
     * Xóa toàn bộ phần tử trong hàng đợi.
     */
    public clear(): void {
        this.heap = [];
    }

    private siftUp(index: number): void {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.comparator(this.heap[index], this.heap[parentIndex]) < 0) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    private siftDown(index: number): void {
        while (true) {
            let smallest = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            if (
                leftChild < this.heap.length &&
                this.comparator(this.heap[leftChild], this.heap[smallest]) < 0
            ) {
                smallest = leftChild;
            }
            if (
                rightChild < this.heap.length &&
                this.comparator(this.heap[rightChild], this.heap[smallest]) < 0
            ) {
                smallest = rightChild;
            }
            if (smallest !== index) {
                this.swap(index, smallest);
                index = smallest;
            } else {
                break;
            }
        }
    }

    private swap(i: number, j: number): void {
        const temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    }
}
