import { Vec } from "../utils/Vec";
import type { Point } from "../utils/Vec";
import { BasicHint } from "./basicHint";
import type { Grid } from "./grid";
import type { Shape } from "./shape";
import { Line } from "../utils/Line";


// A class representing a line that counts the amount of mines intersecting it.
export class MineLine extends BasicHint {
    public pointRotation: Point;
    public contacts: Shape[] = [];
    constructor(grid: Grid, public start: Point, public rotation: number) {
        super(grid);
        this.pointRotation = { x: Math.cos(rotation), y: Math.sin(rotation) };
    }

    public getTextPosition(): Point {
        return this.grid.toVector(Vec.from(this.start).sub(Vec.from(this.pointRotation).scale(0.5)));
    }

    public getText(): string {
        return `${this.contacts.filter(contact => contact.shapeState.hasMine).length}`;
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
    }
}