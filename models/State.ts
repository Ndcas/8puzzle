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
    private static readonly NUMBERS: Set<number> = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
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

    public getTile(x: number, y: number): number {
        let base = State.POW10[8 - 3 * x - y];
        return Math.trunc(this.tiles / base) % 10;
    }

    public getTiles(): number {
        return this.tiles;
    }

    public setTile(x: number, y: number, value: number): void {
        let base = State.POW10[8 - 3 * x - y];
        this.tiles = this.tiles + (value - Math.trunc(this.tiles / base) % 10) * base;
        this.emptyTile = undefined;
        this.euclideanH = undefined;
        this.manhattanH = undefined;
    }

    public getEmptyTile(): Coordinate | undefined {
        if (this.emptyTile == undefined) {
            this.updateEmptyTile();
        }
        return this.emptyTile;
    }

    public getEuclideanH(): number | undefined {
        if (this.euclideanH != undefined) {
            return this.euclideanH;
        }
        let result = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let pos = State.COORDINATE_MAP.get(this.getTile(i, j));
                if (pos == undefined) {
                    return undefined;
                }
                result += Math.sqrt((i - pos.x) * (i - pos.x) + (j - pos.y) * (j - pos.y));
            }
        }
        this.euclideanH = result;
        return result;
    }

    public getManhattanH(): number | undefined {
        if (this.manhattanH != undefined) {
            return this.manhattanH;
        }
        let result = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let pos = State.COORDINATE_MAP.get(this.getTile(i, j));
                if (pos == undefined) {
                    return undefined;
                }
                result += Math.abs(i - pos.x) + Math.abs(j - pos.y);
            }
        }
        this.manhattanH = result;
        return result;
    }

    public toArray(): number[] {
        let result = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result.push(this.getTile(i, j));
            }
        }
        return result;
    }

    public to2DArray(): number[][] {
        let result = new Array(3).fill([]);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                result[i].push(this.getTile(i, j));
            }
        }
        return result;
    }

    public equals(state: State): boolean {
        return this.tiles == state.tiles;
    }

    public isFinish(): boolean {
        return this.tiles == State.GOAL;
    }

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

    public move(opCode: OpCodes): void {
        if (this.emptyTile == undefined) {
            this.updateEmptyTile();
        }
        if (this.emptyTile == undefined) {
            return;
        }
        switch (opCode) {
            case OpCodes.Up:
                this.up();
                break;
            case OpCodes.Down:
                this.down();
                break;
            case OpCodes.Left:
                this.left();
                break;
            case OpCodes.Right:
                this.right();
                break;
        }
    }

    private up(): void {
        if (this.emptyTile!.x == 0) {
            return;
        }
        let x = this.emptyTile!.x;
        let y = this.emptyTile!.y;
        this.setTile(x, y, this.getTile(x - 1, y));
        this.setTile(x - 1, y, 0);
        this.euclideanH = undefined;
        this.manhattanH = undefined;
        this.emptyTile!.x -= 1;
    }

    private down(): void {
        if (this.emptyTile!.x == 2) {
            return;
        }
        let x = this.emptyTile!.x;
        let y = this.emptyTile!.y;
        this.setTile(x, y, this.getTile(x + 1, y));
        this.setTile(x + 1, y, 0);
        this.euclideanH = undefined;
        this.manhattanH = undefined;
        this.emptyTile!.x += 1;
    }

    private left(): void {
        if (this.emptyTile!.y == 0) {
            return;
        }
        let x = this.emptyTile!.x;
        let y = this.emptyTile!.y;
        this.setTile(x, y, this.getTile(x, y - 1));
        this.setTile(x, y - 1, 0);
        this.euclideanH = undefined;
        this.manhattanH = undefined;
        this.emptyTile!.y -= 1;
    }

    private right(): void {
        if (this.emptyTile!.y == 2) {
            return;
        }
        let x = this.emptyTile!.x;
        let y = this.emptyTile!.y;
        this.setTile(x, y, this.getTile(x, y + 1));
        this.setTile(x, y + 1, 0);
        this.euclideanH = undefined;
        this.manhattanH = undefined;
        this.emptyTile!.y += 1;
    }
}