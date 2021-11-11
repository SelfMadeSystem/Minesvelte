import { inverseAngle, toDeg, wrapAngle, approx } from "./Math";
import { equals } from "./ObjectUtils";
import type { Grid, GridPoint } from "./Grid";
import Vec from "./Vec";
import type { Point } from "./Vec";

export function moveShapePoint(shapePoint: ShapePoint, point: Point) {
    shapePoint.x = point.x;
    shapePoint.y = point.y;
    return shapePoint;
}

abstract class ShapePoint implements Point {
    private _x: number;
    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
        this.shape.hasChanged = true;
    }
    private _y: number;
    public get y(): number {
        return this._y;
    }
    public set y(value: number) {
        this._y = value;
        this.shape.hasChanged = true;
    }
    shape: Shape;
    public readonly abstract move: boolean;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public abstract toString(grid: Grid): string;
}

// LineToPoint
class LTP extends ShapePoint {
    public readonly move = false;
    public toString(grid: Grid) {
        const { x, y } = grid.applyMatrix(grid.toVector(this));
        return `L ${x},${y}`;
    }
}

// MoveToPiont
class MTP extends ShapePoint {
    public readonly move = true;
    public toString(grid: Grid) {
        const { x, y } = grid.applyMatrix(grid.toVector(this));
        return `Z M ${x},${y}`;
    }
}

export function lineTo(x: number, y: number) {
    return lineToPoint({ x, y });
}

export function lineToPoint(point: Point): ShapePoint {
    return new LTP(point.x, point.y);
}

export function moveTo(x: number, y: number) {
    return moveToPoint({ x, y });
}

export function moveToPoint(point: Point): ShapePoint {
    return new MTP(point.x, point.y);
}

export class ShapeInfo {
    public get isRevealed(): boolean {
        return this._isRevealed;
    }
    public set isRevealed(value: boolean) {
        this._isRevealed = value;
        this.callback(this);
    }
    public get isFlagged(): boolean {
        return this._isFlagged && !this.isRevealed;
    }
    public set isFlagged(value: boolean) {
        if (this.isRevealed) { return; }
        this._isFlagged = value;
        this.callback(this);
    }
    public get hasMine(): boolean {
        return this._hasMine;
    }
    public set hasMine(value: boolean) {
        this._hasMine = value;
        this.callback(this);
    }
    public get color(): string {
        return this._color;
    }
    public set color(value: string) {
        this._color = value;
        this.callback(this);
    }
    constructor(
        private _color: string = "default",
        private _hasMine: boolean = false,
        private _isFlagged: boolean = false,
        private _isRevealed: boolean = false,
        public callback: (info: ShapeInfo) => void = () => { },
    ) {
    }

    public getState(hovering: boolean): string {
        if (this.isRevealed) {
            if (this.hasMine) {
                return "exploded";
            }
            return "revealed";
        }
        if (this.isFlagged) {
            return "flagged";
        }
        if (hovering) {
            return "hovering";
        }
        return "normal";
    }
}

export class Shape {
    public contacts: Shape[] = [];
    public callback: (shape: Shape) => void = () => { };
    public readonly shapeInfo: ShapeInfo = new ShapeInfo()
    hasChanged = true;
    constructor(public readonly grid: Grid, public readonly points: ShapePoint[], hasMine: boolean = false) {
        this.shapeInfo.hasMine = hasMine;
        this.shapeInfo.callback = () => this.callback(this);
        this.points.forEach(p => p.shape = this);
        this.getPoints();
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
    public get number() {
        return this.contacts.filter(s => s.shapeInfo.hasMine).length;
    }
    private uptadingContacts: boolean = false;

    updateContacts() {
        if (this.uptadingContacts) {
            return;
        }
        this.uptadingContacts = true;
        var prevContacts = this._updateContacts();
        this.contacts.forEach(s => s._updateContacts());
        prevContacts.forEach(s => s._updateContacts());
        this.uptadingContacts = false;
    }

    _updateContacts() {
        var prevContacts = this.contacts;
        this.contacts = this.grid.shapes.filter(s => s !== this && this.isCorner(s));
        this.callback(this);
        return prevContacts.filter(s => !this.contacts.includes(s));
    }

    reveal() {
        if (this.shapeInfo.isRevealed) return;
        this.shapeInfo.isRevealed = true;
        if (!this.shapeInfo.hasMine && this.number === 0) {
            this.contacts.forEach(s => s.reveal());
        }
        this.callback(this);
    }

    isAdjacent(other: Shape) {
        return this._isAdjacent(this.lines, other.lines);
    }

    isCorner(other: Shape) { // includes adjacent
        return this.getPoints().some(p => p.shapes.includes(other));
        // const otherPoints = other.getPoints();
        // return this.getPoints().some(p => otherPoints.some(p2 => p.x === p2.x && p.y === p2.y));
        // return this._isCorner(this.lines, other.lines);
    }

    _isAdjacent(self: Line[], them: Line[]) {
        return self.some(l1 => them.some(l2 => {
            if (!(approx(l2.rotation, l1.rotation) || approx(l2.rotation, inverseAngle(l1.rotation)))) {
                return false;
            }
            const points1 = this.grid.getAllInLine(l1.p1, l1.p2);
            const points2 = this.grid.getAllInLine(l2.p1, l2.p2);
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

    private prevPoints: GridPoint[] = [];

    getPoints() {
        if (!this.hasChanged) {
            return this.prevPoints;
        }
        var points: GridPoint[] = [];
        const lines = this.lines;
        for (let i = 0; i < lines.length; i++) {
            const element = lines[i];
            points.push(...this.grid.getAllInLine(element.p1, element.p2));
        }
        this.prevPoints.forEach(p => {
            if (!points.some(p2 => equals(p, p2))) {
                p.shapes.splice(p.shapes.indexOf(this), 1);
            }
        });
        points.forEach(p => {
            if (!p.shapes.includes(this)) {
                p.shapes.push(this);
            }
        });
        this.prevPoints = points;
        return points;
    }

    getCenter() {
        var center = { x: this.points[0].x, y: this.points[0].y }
        for (let i = 1; i < this.points.length; i++) {
            var p = this.points[i];
            center.x += p.x;
            center.y += p.y;
        }
        center.x /= this.points.length;
        center.y /= this.points.length;
        return center;
    }

    toString() {
        return this.points.map(p => p.toString(this.grid)).join(' ').slice(2) + ' z';
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