import State, { OpCodes } from "./State";

export default class Tree {
    private parent: Tree | null;
    private state: State;
    private opCode: OpCodes | null;

    public constructor(parent: Tree | null, state: State, opCode: OpCodes | null) {
        this.parent = parent;
        this.state = state;
        this.opCode = opCode;
    }

    public getParent(): Tree | null {
        return this.parent;
    }

    public getState(): State {
        return this.state;
    }

    public getOpCode(): OpCodes | null {
        return this.opCode;
    }

    public getOpCodes(): OpCodes[] {
        let result: OpCodes[] = [];
        this.getOpCodesRecursion(result);
        return result;
    }

    private getOpCodesRecursion(resultArray: OpCodes[]): void {
        if (this.parent != null) {
            this.parent.getOpCodesRecursion(resultArray);
        }
        if (this.opCode != null) {
            resultArray.push(this.opCode);
        }
    }

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