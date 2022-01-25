import type { Grid } from "./grid";
import type { Shape, ShapeMove } from "./shape";

export class Move {
    constructor(
        public shape: Shape,
        public move: ShapeMove,
        public state: boolean,
    ) {
    }

    public undo() {
        this.shape.shapeState[this.move] = !this.state;
    }

    public redo() {
        this.shape.shapeState[this.move] = this.state;
    }
}

export class HistoryProcessor {
    public moves: Move[] = [];
    public currentMove: number = -1;
    private justChanged: boolean = false;

    constructor(public grid: Grid) {
    }

    public addMove(shape: Shape, move: ShapeMove, state: boolean) {
        this.moves = this.moves.slice(0, this.currentMove + 1);
        this.moves.push(new Move(shape, move, state));
        this.currentMove++;
    }

    public undo() {
        if (this.currentMove >= 0) {
            this.justChanged = true;
            this.moves[this.currentMove].undo();
            this.currentMove--;
        }
    }

    public redo() {
        if (this.currentMove < this.moves.length - 1) {
            this.justChanged = true;
            this.currentMove++;
            this.moves[this.currentMove].redo();
        }
    }

    public reset() {
        this.moves = [];
        this.currentMove = -1;
        this.grid.shapes.forEach(shape => {
            shape.shapeStateNotify.subscribe((s) => {
                if (this.justChanged) {
                    this.justChanged = false;
                    return;
                }
                if (s.changed === "isRevealed" || s.changed === "isFlagged")
                    this.addMove(shape, s.changed, s.newState[s.changed] as boolean);
            })
        });
    }
}