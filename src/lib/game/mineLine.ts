import { Vec } from "../utils/Vec";
import type { Point } from "../utils/Vec";
import { BasicHint, Hint } from "./basicHint";
import type { Grid } from "./grid";
import type { Shape } from "./shape";
import { Line } from "../utils/Line";


// A class representing a line that counts the amount of mines intersecting it.
export class MineLine extends BasicHint {
    public pointRotation: Point;
    public contacts: Shape[] = [];
    public number: number = 0;
    constructor(grid: Grid, public start: Point, public rotation: number) {
        super(grid);
        this.pointRotation = { x: Math.cos(rotation), y: Math.sin(rotation) };
    }

    public getTextPosition(): Point {
        return this.grid.toVector(Vec.from(this.start).sub(Vec.from(this.pointRotation).scale(0.5)));
    }

    public getText(): string {
        return `${this.number}`;
    }

    public getLine(length: number): Line {
        const start = Vec.from(this.start);
        const end = start.add(Vec.from(this.pointRotation).scale(length));
        return new Line(start, end);
    }

    public updateContacts(): void {
        const aLine = this.getLine(10000);
        this.contacts = this.grid.shapes.filter(shape =>
            shape.lines.some(line => line.intersects(aLine))
        );
        this.number = this.contacts.reduce((a, c) => a + Number(c.solverState.hasMine), 0);
    }

    public asHint(): Hint {
        const hint: Hint = new Hint(this.contacts.filter(c => c.solverState.unknown),
            this.number - this.contacts.reduce((a, c) => a + Number(c.solverState.mineKnown), 0));
        return hint;
    }
}