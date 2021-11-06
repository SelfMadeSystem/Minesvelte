import { inverseAngle, toDeg, wrapAngle, approx } from "./Math";
import { equals } from "./ObjectUtils";
import type { Grid, Point } from "./Grid";
import Vec from "./Vec";

export function moveShapePoint(shapePoint: ShapePoint, point: Point) {
    shapePoint.x = point.x;
    shapePoint.y = point.y;
    return shapePoint;
}

export interface ShapePoint extends Point {
    move: boolean;
    toString: (grid: Grid) => string;
}

class LTP implements ShapePoint {
    public x: number;
    public y: number;
    public move: boolean = false;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public toString(grid: Grid) {
        const { x, y } = grid.applyToVector(grid.toVector(this.x, this.y));
        return `L ${x},${y}`;
    }
}

class MTP implements ShapePoint {
    public x: number;
    public y: number;
    public move: boolean = true;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public toString(grid: Grid) {
        const { x, y } = grid.applyToVector(grid.toVector(this.x, this.y));
        return `M ${x},${y}`;
    }
}

export function lineTo(x: number, y: number) {
    return lineToPoint({x, y});
}

export function lineToPoint(point: Point): ShapePoint {
    return new LTP(point.x, point.y);
};

export function moveTo(x: number, y: number) {
    return moveToPoint({x, y});
}

export function moveToPoint(point: Point): ShapePoint {
    return new MTP(point.x, point.y);
}

export class ShapeInfo {
    constructor(
        public color: string = "default",
        public hasMine: boolean = false,
        public isFlagged: boolean = false,
        public isRevealed: boolean = false,
    ) {
    }

    public getState(hovering: boolean): string {
        if (this.isFlagged) {
            return "flagged";
        }
        if (this.isRevealed) {
            return "revealed";
        }
        if (hovering) {
            return "hovering";
        }
        return "normal";
    }
}

export class Shape {
    public contacts: Shape[] = [];
    constructor(public readonly grid: Grid, public readonly points: ShapePoint[], public readonly shapeInfo: ShapeInfo = new ShapeInfo()) {
    }

    public get lines(): Line[] {
        var lines: Line[] = [];
        var first: ShapePoint = this.points[0];
        var prev: ShapePoint = this.points[0];
        for (let i = 1; i < this.points.length; i++) {
            const p = this.points[i];
            if (p.move) {
                lines.push(new Line(this.grid, prev, first));
                first = p;
            } else {
                lines.push(new Line(this.grid, p, prev));
            }
            prev = p;
        }
        lines.push(new Line(this.grid, prev, first));
        return lines;
    }

    private uptadingContacts: boolean;

    updateContacts() {
        if (this.uptadingContacts) {
            return;
        }
        this.uptadingContacts = true;
        this.contacts = this.grid.info.shapes.filter(s => s !== this && this.isAdjacent(s));
        this.contacts.forEach(s => s.updateContacts());
        this.uptadingContacts = false;
    }

    isAdjacent(other: Shape) {
        return this._isAdjacent(this.lines, other.lines);
    }

    isCorner(other: Shape) { // includes adjacent
        return this._isCorner(this.lines, other.lines);
    }

    _isAdjacent(self: Line[], them: Line[]) {
        return self.some(l1 => them.some(l2 => {
            if (!(approx(l2.rotation, l1.rotation) || approx(l2.rotation, inverseAngle(l1.rotation)))) {
                return false;
            }
            const points1 = this.grid.getAllInLinePoint(l1.p1, l1.p2);
            const points2 = this.grid.getAllInLinePoint(l2.p1, l2.p2);
            let found = false;
            return points1.some(p => points2.some(p2 => {
                if (equals(p, p2)) {
                    if (found) {
                        return true;
                    }
                    found = true;
                }
            }))
        }))
    }

    _isCorner(self: Line[], them: Line[]) {
        return self.some(l1 => {
            const points = this.grid.getAllInLinePoint(l1.p1, l1.p2);
            return them.some(l2 => points.some(p => equals(p, l2.p1) || equals(p, l2.p2)))
        }) || them.some(l1 => {
            const points = this.grid.getAllInLinePoint(l1.p1, l1.p2);
            return self.some(l2 => points.some(p => equals(p, l2.p1) || equals(p, l2.p2)))
        });
    }

    getPoints() {
        var points: Point[] = [];
        const lines = this.lines;
        for (let i = 0; i < lines.length; i++) {
            const element = lines[i];
            points.push(...this.grid.getAllInLinePoint(element.p1, element.p2));
        }
        return points;
    }

    toString() {
        return this.points.map(p => (p.move ? 'z ' : '') + p.toString(this.grid)).join(' ').slice(2) + ' z';
    }
}

export class Line {
    public readonly v1: Vec;
    public readonly v2: Vec;
    constructor(public readonly grid: Grid, public readonly p1: Point, public readonly p2: Point) {
        this.v1 = new Vec(p1.x, p1.y);
        this.v2 = new Vec(p2.x, p2.y);
    }

    public get dx(): number {
        return this.p2.x - this.p1.x;
    }

    public get dy(): number {
        return this.p2.y - this.p1.y;
    }

    public get rotation(): number {
        return wrapAngle(toDeg(Math.atan2(this.dy, this.dx)));
    }

    public get sizeSq(): number {
        return this.v2.distanceSq(this.v1);
    }
}