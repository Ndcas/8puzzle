export type Coordinate = {
    x: number,
    y: number
};

export enum OpCodes {
    Up = 1,
    Down = 2,
    Left = 3,
    Right = 4
}

export default class State {
    private static readonly POW10: number[] = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000];
    private static readonly NUMBERS: Set<number> = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    private static readonly GOAL: number = 123804765;
    private static readonly COORDINATE_MAP: Map<number, Coordinate> = new Map([
        [0, { x: 1, y: 1 }],
        [1, { x: 0, y: 0 }],
        [2, { x: 0, y: 1 }],
        [3, { x: 0, y: 2 }],
        [4, { x: 1, y: 2 }],
        [5, { x: 2, y: 2 }],
        [6, { x: 2, y: 1 }],
        [7, { x: 2, y: 0 }],
        [8, { x: 1, y: 0 }],
    ]);
    private tiles: number;
    private emptyTile: Coordinate | undefined;
    private euclideanH: number | undefined;
    private manhattanH: number | undefined;

    /**
     * Khởi tạo trạng thái mới. Nếu không có tham số, sẽ tạo trạng thái mặc định (trạng thái đích).
     * @param state Trạng thái gốc để sao chép (tùy chọn).
     */
    public constructor(state?: State) {
        if (state == undefined) {
            this.tiles = 123804765;
            this.emptyTile = { ...State.COORDINATE_MAP.get(0)! };
            this.euclideanH = 0;
            this.manhattanH = 0;
            return;
        }
        this.tiles = state.tiles;
        if (state.emptyTile != undefined) {
            this.emptyTile = { ...state.emptyTile };
        }
        this.euclideanH = state.euclideanH;
        this.manhattanH = state.manhattanH;
    }

    /**
     * Lấy giá trị của ô số tại tọa độ (x, y).
     * @param x Chỉ số hàng (0-2).
     * @param y Chỉ số cột (0-2).
     * @returns Giá trị ô số (0-8).
     */
    public getTile(x: number, y: number): number {
        let base = State.POW10[8 - 3 * x - y];
        return Math.trunc(this.tiles / base) % 10;
    }

    /**
     * Lấy giá trị số nguyên đại diện cho toàn bộ trạng thái hiện tại.
     * @returns Số nguyên 9 chữ số.
     */
    public getTiles(): number {
        return this.tiles;
    }

    /**
     * Cập nhật giá trị của một ô số tại tọa độ (x, y). 
     * Tự động cập nhật vị trí ô trống và reset các giá trị Heuristic.
     * @param x Chỉ số hàng.
     * @param y Chỉ số cột.
     * @param value Giá trị mới cần đặt.
     */
    public setTile(x: number, y: number, value: number): void {
        let base = State.POW10[8 - 3 * x - y];
        let oldValue = Math.trunc(this.tiles / base) % 10;
        if (oldValue == value) {
            return;
        }
        this.tiles = this.tiles + (value - oldValue) * base;
        if (value == 0) {
            this.emptyTile = { x, y };
        } else if (this.emptyTile && this.emptyTile.x == x && this.emptyTile.y == y) {
            this.emptyTile = undefined;
        }
        this.euclideanH = undefined;
        this.manhattanH = undefined;
    }

    /**
     * Lấy tọa độ của ô trống (số 0).
     * @returns Đối tượng Coordinate {x, y} hoặc undefined nếu chưa xác định.
     */
    public getEmptyTile(): Coordinate | undefined {
        if (this.emptyTile == undefined) {
            this.updateEmptyTile();
        }
        return this.emptyTile;
    }

    /**
     * Tính toán hoặc trả về giá trị Heuristic Euclidean (khoảng cách đường thẳng).
     * @returns Giá trị Heuristic Euclidean.
     */
    public getEuclideanH(): number | undefined {
        if (this.euclideanH != undefined) {
            return this.euclideanH;
        }
        let result = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let tile = this.getTile(i, j);
                if (tile == 0) {
                    continue;
                }
                let pos = State.COORDINATE_MAP.get(tile);
                if (pos == undefined) {
                    return undefined;
                }
                result += Math.sqrt((i - pos.x) * (i - pos.x) + (j - pos.y) * (j - pos.y));
            }
        }
        this.euclideanH = result;
        return result;
    }

    /**
     * Tính toán hoặc trả về giá trị Heuristic Manhattan (khoảng cách theo trục tọa độ).
     * @returns Giá trị Heuristic Manhattan.
     */
    public getManhattanH(): number | undefined {
        if (this.manhattanH != undefined) {
            return this.manhattanH;
        }
        let result = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let tile = this.getTile(i, j);
                if (tile == 0) {
                    continue;
                }
                let pos = State.COORDINATE_MAP.get(tile);
                if (pos == undefined) {
                    return undefined;
                }
                result += Math.abs(i - pos.x) + Math.abs(j - pos.y);
            }
        }
        this.manhattanH = result;
        return result;
    }

    /**
     * Chuyển đổi trạng thái hiện tại thành mảng 1 chiều.
     * @returns Mảng 9 phần tử.
     */
    public toArray(): number[] {
        let result = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result.push(this.getTile(i, j));
            }
        }
        return result;
    }

    /**
     * Chuyển đổi trạng thái hiện tại thành mảng 2 chiều (3x3).
     * @returns Mảng 2 chiều 3x3.
     */
    public to2DArray(): number[][] {
        let result = [];
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = 0; j < 3; j++) {
                row.push(this.getTile(i, j));
            }
            result.push(row);
        }
        return result;
    }

    /**
     * So sánh trạng thái hiện tại với một trạng thái khác.
     * @param state Trạng thái cần so sánh.
     * @returns True nếu giống nhau, ngược lại False.
     */
    public equals(state: State): boolean {
        return this.tiles == state.tiles;
    }

    /**
     * Kiểm tra xem trạng thái hiện tại đã đạt tới trạng thái đích chưa.
     * @returns True nếu đã hoàn thành.
     */
    public isFinish(): boolean {
        return this.tiles == State.GOAL;
    }

    /**
     * Kiểm tra xem trạng thái hiện tại có thể giải được hay không dựa trên số lượng nghịch thế (Inversions).
     * @returns True nếu trạng thái có thể giải được.
     */
    public isSolvable(): boolean {
        let tiles = this.toArray();
        let numberSet = new Set(tiles);
        if (numberSet.size != 9) {
            return false;
        }
        for (let number of numberSet) {
            if (!State.NUMBERS.has(number)) {
                return false;
            }
        }
        let inversions = 0;
        for (let i = 0; i < 9; i++) {
            if (tiles[i] == 0) {
                continue;
            }
            for (let j = i + 1; j < 9; j++) {
                if (tiles[j] == 0) {
                    continue;
                }
                if (tiles[i] > tiles[j]) {
                    inversions++;
                }
            }
        }
        return inversions % 2 != 0;
    }

    /**
     * Tìm kiếm và cập nhật tọa độ của ô trống trong trạng thái hiện tại.
     */
    public updateEmptyTile(): void {
        this.emptyTile = undefined;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.getTile(i, j) == 0) {
                    this.emptyTile = { x: i, y: j };
                    return;
                }
            }
        }
    }

    /**
     * Thực hiện di chuyển ô trống theo một hướng xác định.
     * @param opCode Hướng di chuyển (Up, Down, Left, Right).
     */
    public move(opCode: OpCodes): void {
        let emptyTile = this.getEmptyTile();
        if (emptyTile == undefined) {
            return;
        }
        let x = emptyTile.x;
        let y = emptyTile.y;
        switch (opCode) {
            case OpCodes.Up:
                x--;
                break;
            case OpCodes.Down:
                x++;
                break;
            case OpCodes.Left:
                y--;
                break;
            case OpCodes.Right:
                y++;
                break;
        }
        if (x < 0 || x > 2 || y < 0 || y > 2) {
            return;
        }
        this.setTile(emptyTile.x, emptyTile.y, this.getTile(x, y));
        this.setTile(x, y, 0);
    }
}