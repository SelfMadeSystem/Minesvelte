import { inverseAngle, toDeg, wrapAngle, approx } from "../utils/Math";
import type { Grid, GridPoint } from "./grid";
import Vec from "../utils/Vec";
import type { Point } from "../utils/Vec";
import { Notifier } from "../utils/Notifier";
import type { ShapeCollection } from "./solver";
import { Rect } from "../utils/rect";

export function moveShapePoint(shapePoint: ShapePoint, point: Point) {
    shapePoint.x = point.x;
    shapePoint.y = point.y;
    return shapePoint;
}

export abstract class ShapePoint implements Point {
    private _x: number;
    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
        if (this.shape) this.shape.hasChanged = true;
    }
    private _y: number;
    public get y(): number {
        return this._y;
    }
    public set y(value: number) {
        this._y = value;
        if (this.shape) this.shape.hasChanged = true;
    }
    shape: Shape;
    public readonly abstract move: boolean;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public abstract toString(grid: Grid): string;
    public abstract clone(): ShapePoint;
}

// LineToPoint
class LTP extends ShapePoint {
    public readonly move = false;
    public toString(grid: Grid) {
        const { x, y } = grid.toVector(this);
        return `L ${x},${y}`;
    }
    public clone() {
        return new LTP(this.x, this.y);
    }
}

// MoveToPiont
class MTP extends ShapePoint {
    public readonly move = true;
    public toString(grid: Grid) {
        const { x, y } = grid.toVector(this);
        return `Z M ${x},${y}`;
    }
    public clone() {
        return new MTP(this.x, this.y);
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

export class ShapeState {
    public get isRevealed(): boolean {
        return this._isRevealed;
    }
    public set isRevealed(value: boolean) {
        if (this.isFlagged) return;
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

    public get mineKnown() {
        return (this.hasMine && this.isRevealed) || this.isFlagged;
    }
    public get noMineKnown() {
        return this.isRevealed && !this.isFlagged && !this.hasMine;
    }
    public get unknown() {
        return !this.isRevealed && !this.isFlagged;
    }

    constructor(
        private _color: string = "default",
        private _hasMine: boolean = false,
        private _isFlagged: boolean = false,
        private _isRevealed: boolean = false,
        public callback: (info: ShapeState) => void = () => { },
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

    public getZIndex(hovering: boolean): number {
        if (this.isRevealed) {
            if (this.hasMine) {
                return 4;
            }
            return 0;
        }
        if (this.isFlagged) {
            return 3;
        }
        if (hovering) {
            return 2;
        }
        return 1;
    }
}

// Todo: make shapes and grid not integers. I don't need to make them integers lol.
export class Shape {
    public contacts: Shape[] = [];
    public readonly shapeState: ShapeState = new ShapeState()
    public readonly shapeStateNotify: Notifier<ShapeState> = new Notifier();
    public readonly notifyContactChange: Notifier<Shape[]> = new Notifier();
    hasChanged = true;
    public A_position: Point;
    public solver_shapeCollections: ShapeCollection[] = []; // For solver to use
    public bounds: Rect;
    // public solver_selfShapeCollection: ShapeCollection; // For solver to use
    constructor(public readonly grid: Grid, public readonly points: ShapePoint[], hasMine: boolean = false) {
        this.shapeState.hasMine = hasMine;
        this.shapeState.callback = () => this.shapeStateNotify.notify(this.shapeState);
        this.points.forEach(p => p.shape = this);
        this.getBounds();
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
        return this.contacts.filter(s => s.shapeState.hasMine).length;
    }

    public getBounds() {
        var minX = Number.MAX_SAFE_INTEGER;
        var minY = Number.MAX_SAFE_INTEGER;
        var maxX = Number.MIN_SAFE_INTEGER;
        var maxY = Number.MIN_SAFE_INTEGER;
        this.points.forEach(p => {
            if (p.x < minX) minX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.x > maxX) maxX = p.x;
            if (p.y > maxY) maxY = p.y;
        });
        this.bounds = new Rect({
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        });
    }

    private uptadingContacts: boolean = false;

    updateContacts() {
        if (this.uptadingContacts) {
            return;
        }
        this.uptadingContacts = true;
        var prevContacts = this._updateContacts();
        new Set([...this.contacts, ...prevContacts]).forEach(s => s._updateContacts());
        this.uptadingContacts = false;
    }

    _updateContacts() {
        var prevContacts = this.contacts;
        this.contacts = this.grid.shapes.filter(s => s !== this && this.isCorner(s));
        this.notifyContactChange.notify(this.contacts);
        return prevContacts.filter(s => !this.contacts.includes(s));
    }

    reveal() {
        if (this.shapeState.isRevealed) return;
        this.shapeState.isRevealed = true;
        if (!this.shapeState.hasMine && this.number === 0) {
            this.contacts.forEach(s => s.reveal());
        }
    }

    flag() {
        this.shapeState.isFlagged = true;
    }

    isAdjacent(other: Shape) {
        return this.lines.some(l => other.lines.some(ol => {
            if (l.isParallel(ol)) {
                return l.isBetweenExclusive(ol.p1) || l.isBetweenExclusive(ol.p2) || (
                    l.isBetween(ol.p1) && l.isBetween(ol.p2)
                );
            }
            return false;
        }));
    }

    isCorner(other: Shape) { // includes adjacent
        return this.lines.some(l => other.points.some(p => l.isBetween(p)));
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

    public isParallel(other: Line): boolean {
        return this.rotation === other.rotation || this.rotation === wrapAngle(other.rotation + 180);
    }

    public isBetween(currPoint: Point): boolean {
        var point1 = this.p1;
        var point2 = this.p2;
        let dxc = currPoint.x - point1.x;
        let dyc = currPoint.y - point1.y;

        let dxl = point2.x - point1.x;
        let dyl = point2.y - point1.y;

        let cross = dxc * dyl - dyc * dxl;
        if (Math.abs(cross) > 0.00001)
            return false;

        if (Math.abs(dxl) >= Math.abs(dyl))
            return dxl > 0 ?
                point1.x <= currPoint.x && currPoint.x <= point2.x :
                point2.x <= currPoint.x && currPoint.x <= point1.x;
        else
            return dyl > 0 ?
                point1.y <= currPoint.y && currPoint.y <= point2.y :
                point2.y <= currPoint.y && currPoint.y <= point1.y;
    }

    public isBetweenExclusive(currPoint: Point): boolean {
        var point1 = this.p1;
        var point2 = this.p2;
        let dxc = currPoint.x - point1.x;
        let dyc = currPoint.y - point1.y;

        let dxl = point2.x - point1.x;
        let dyl = point2.y - point1.y;

        let cross = dxc * dyl - dyc * dxl;
        if (Math.abs(cross) > 0.00001)
            return false;

        const epsilon = 0.00001;

        if (Math.abs(dxl) >= Math.abs(dyl))
            return dxl > 0 ?
                point1.x < currPoint.x - epsilon && currPoint.x < point2.x - epsilon :
                point2.x < currPoint.x - epsilon && currPoint.x < point1.x - epsilon;
        else
            return dyl > 0 ?
                point1.y < currPoint.y - epsilon && currPoint.y < point2.y - epsilon :
                point2.y < currPoint.y - epsilon && currPoint.y < point1.y - epsilon;
    }
}