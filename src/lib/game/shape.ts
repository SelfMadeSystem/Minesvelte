import type { Grid } from "./grid";
import type { Point } from "../utils/Vec";
import { Notifier } from "../utils/Notifier";
import type { ShapeCollection } from "./solver";
import { Rect } from "../utils/rect";
import { Line } from "../utils/Line";
import { BasicHint } from "./basicHint";

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
    public get isHighlighed(): boolean {
        return this._isHighlighed;
    }
    public set isHighlighed(value: boolean) {
        this._isHighlighed = value;
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
        private _isHighlighed: boolean = false,
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
            return "hover";
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
export class Shape extends BasicHint {
    public contacts: Shape[] = [];
    public readonly shapeState: ShapeState = new ShapeState()
    public readonly shapeStateNotify: Notifier<ShapeState> = new Notifier();
    public readonly notifyContactChange: Notifier<Shape[]> = new Notifier();
    hasChanged = true;
    public A_position: Point;
    public solver_shapeCollections: ShapeCollection[] = []; // For solver to use
    public bounds: Rect;
    // public solver_selfShapeCollection: ShapeCollection; // For solver to use
    constructor(grid: Grid, public readonly points: ShapePoint[], hasMine: boolean = false) {
        super(grid);
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
                lines.push(new Line(prev, first));
                first = p;
            } else {
                lines.push(new Line(p, prev));
            }
            prev = p;
        }
        lines.push(new Line(prev, first));
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

    getTextPosition() {
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

    getText() {
        if (this.shapeState.isRevealed) {
            if (this.shapeState.hasMine) {
                return "";
            }
            return this.number === 0 ? "" : this.number.toString();
        }
        return "";
    }

    toString() {
        return this.points.map(p => p.toString(this.grid)).join(' ').slice(2) + ' z';
    }
}
