import type { Grid } from "./grid";
import type { HexPoint, Point } from "../utils/Vec";
import { Notifier } from "../utils/Notifier";
import type { ShapeCollection } from "./solver";
import { Rect } from "../utils/rect";
import { Line } from "../utils/Line";
import { BasicHint, Hint } from "./basicHint";
import type { SpecificColors } from "../utils/Colors";
import { mdiFlagCheckered, mdiMine } from '@mdi/js';
import { mdiFlag } from '@mdi/js';

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

export type ShapeStates = "normal" | "revealed" | "flagged" | "exploded";

export type StateType = "solverState" | "shapeState";

export class ShapeState {
    public get isRevealed(): boolean {
        return this._isRevealed;
    }
    public set isRevealed(value: boolean) {
        if (this.isFlagged) return;
        this._isRevealed = value;
        this.notifier.notify(this);
    }
    public get isFlagged(): boolean {
        return this._isFlagged && !this.isRevealed;
    }
    public set isFlagged(value: boolean) {
        if (this.isRevealed) { return; }
        this._isFlagged = value;
        this.notifier.notify(this);
    }
    public get hasMine(): boolean {
        return this._hasMine;
    }
    public set hasMine(value: boolean) {
        this._hasMine = value;
        this.notifier.notify(this);
    }
    public get isHighlighed(): boolean {
        return this._highlightation.length > 0;
    }
    public setHighlighed(obj: any, value: boolean) {
        if (value) {
            this._highlightation.push(obj);
        } else {
            this._highlightation = this._highlightation.filter((o) => o !== obj);
        }
        this.notifier.notify(this);
    }
    public get color(): SpecificColors {
        return this._color;
    }
    public set color(value: SpecificColors) {
        this._color = value;
        this.notifier.notify(this);
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
        protected _color: SpecificColors = "default",
        protected _hasMine: boolean = false,
        protected _isFlagged: boolean = false,
        protected _isRevealed: boolean = false,
        protected _highlightation: any[] = [],
        public notifier: Notifier<ShapeState> = new Notifier(),
    ) {
    }

    public getState(): ShapeStates {
        if (this.isRevealed) {
            if (this.hasMine) {
                return "exploded";
            }
            return "revealed";
        }
        if (this.isFlagged) {
            return "flagged";
        }
        return "normal";
    }
}

export class SolverState extends ShapeState {
    constructor(
        public base: ShapeState,
    ) {
        super();
        base.notifier.subscribe((s) => {
            this._color = s.color;
            this._hasMine = s.hasMine;
            this._isFlagged = s.isFlagged;
            this._isRevealed = s.isRevealed;
        })
        this.apply();
    }

    public apply() {
        this.base.color = this._color;
        this.base.hasMine = this._hasMine;
        this.base.isFlagged = this._isFlagged;
        this.base.isRevealed = this._isRevealed;
    }

    public reset() {
        this._color = this.base.color;
        this._hasMine = this.base.hasMine;
        this._isFlagged = this.base.isFlagged;
        this._isRevealed = this.base.isRevealed;
    }
}

export class Shape extends BasicHint {
    public A_position: Point;
    public A_hexPosition: HexPoint;
    public contacts: Shape[] = [];
    public readonly shapeState: ShapeState = new ShapeState();
    public readonly solverState: SolverState = new SolverState(this.shapeState);
    public readonly shapeStateNotify: Notifier<ShapeState> = new Notifier();
    public readonly notifyContactChange: Notifier<Shape[]> = new Notifier();
    hasChanged = true;
    public adjacentShapesNumber: boolean = false;
    public bounds: Rect;
    public id: number;
    public solver_shapeCollections: ShapeCollection[] = []; // For solver to use
    // public solver_selfShapeCollection: ShapeCollection; // For solver to use
    constructor(grid: Grid, public readonly points: ShapePoint[], hasMine: boolean = false) {
        super(grid);
        this.shapeState.hasMine = hasMine;
        this.shapeState.notifier.subscribe(() => this.shapeStateNotify.notify(this.shapeState));
        this.points.forEach(p => p.shape = this);
        this.getBounds();
        this.id = this.grid.shapeId++;
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

    reveal(state: StateType = "shapeState") {
        if (this[state].isRevealed) return false;
        this[state].isRevealed = true;
        if (!this.shapeState.hasMine && this.number === 0) {
            this.contacts.forEach(s => s.reveal(state));
        }
        return true;
    }

    flag(bot: boolean = true, state: StateType = "shapeState") {
        if (bot && this[state].isFlagged) return false;
        this[state].isFlagged = bot || !this[state].isFlagged;
        return true;
    }

    isAdjacent(other: Shape) {
        return this._isAdjacent(other);
    }

    private _isAdjacent(other: Shape) {
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

    areAllAdjacent(): boolean {
        return Shape.checkAllAdjacent([...this.contacts].filter(s => s.shapeState.hasMine));
    }

    static checkAllAdjacent(shapes: Shape[]): boolean {
        var current = shapes.shift();

        while (shapes.length > 0) {
            var contacts = shapes.filter(s => s.isAdjacent(current));
            if (contacts.length === 0) {
                return false;
            } else {
                contacts.forEach(s => Shape._areAllAdjacent(s, shapes));
            }
        }
        return true;
    }

    static _areAllAdjacent(shape: Shape, shapes: Shape[]) {
        shapes.splice(shapes.indexOf(shape), 1);
        var contacts = shapes.filter(s => s.isAdjacent(shape));
        if (contacts.length === 0) {
            return;
        }
        contacts.forEach(s => Shape._areAllAdjacent(s, shapes));
    }

    getNumText() {
        if (this.adjacentShapesNumber && this.number > 1) {
            if (this.areAllAdjacent()) {
                return `{${this.number}}`;
            } else {
                return `-${this.number}-`;
            }
        }
        return this.number.toString();
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

    private getShapeArea() {
        let area = 0;

        for (let i = 0; i < this.points.length - 1; ++i) {
            area += this.points[i].x * this.points[i + 1].y - this.points[i + 1].x * this.points[i].y;
        }

        area += this.points[this.points.length - 1].x * this.points[0].y - this.points[0].x * this.points[this.points.length - 1].y;

        return area = Math.abs(area) / 2;
    }

    getTextSize(): number {
        var size = this.getShapeArea();
        return Math.min(0.5, size * 0.6);
    }

    getText() {
        if (this.shapeState.isRevealed && !this.shapeState.hasMine) {
            return this.number === 0 ? "" : this.getNumText();
        }
        return "";
    }

    getIcon() {
        if (this.shapeState.isRevealed && this.shapeState.hasMine) {
            return {
                path: mdiMine,
                fill: "red",
                stroke: "transparent",
                size: 24,
            };
        }
        if (this.shapeState.isFlagged) {
            return {
                path: mdiFlag,
                fill: "black",
                stroke: "transparent",
                size: 24,
            };
        }
        return null;
    }

    toString() {
        return this.points.map(p => p.toString(this.grid)).join(' ').slice(2) + ' z';
    }

    public asHint(): Hint {
        var minesAlreadyKnown = this.contacts.filter(c => c.shapeState.mineKnown);
        var hint: Hint = new Hint(this.contacts.filter(c => c.shapeState.unknown), this.number - this.contacts.reduce((a, c) => a + Number(c.shapeState.mineKnown), 0),
            this.adjacentShapesNumber && this.number > 1 ?
                this.areAllAdjacent() ?
                    (p) => Hint.defaultVerify(p, hint) && Shape.checkAllAdjacent([...minesAlreadyKnown, ...hint.getShapes(p)]) :
                    (p) => Hint.defaultVerify(p, hint) && !Shape.checkAllAdjacent([...minesAlreadyKnown, ...hint.getShapes(p)]) :
                (p) => Hint.defaultVerify(p, hint));
        return hint;
    }
}
