import Vec from "./Vec";
import { gcd } from "./Math";
import type { GridInfo } from "./GridInfo";
import { winSize } from "../stores";
import { lineTo, moveTo, Shape } from "./Shape";

export interface Point {
    x: number;
    y: number;
}

export function getMousePoint(x: number, y: number, grid: Grid): Point {
    const relativeX = x - winSize.width / 2;
    const relativeY = y - winSize.height / 2;
    const vec1 = grid.applyFromVector(new Vec(relativeX, relativeY));
    const { x: a, y: b } = grid.fromVectorPoint({
        x: vec1.x,
        y: vec1.y,
    });
    return grid.getPoint(Math.round(a), Math.round(b));
}

export function mouseDistFromClosestPoint(
    x: number,
    y: number,
    grid: Grid,
    points?: Point[]
): number {
    const relativeX = x - winSize.width / 2;
    const relativeY = y - winSize.height / 2;
    const vec1 = grid.applyFromVector(new Vec(relativeX, relativeY));
    const { x: a, y: b } = grid.fromVectorPoint({
        x: vec1.x,
        y: vec1.y,
    });
    if (points) {
        const closestPoint = points.reduce(
            (prev, curr) =>
                Math.hypot(a - curr.x, b - curr.y) <
                Math.hypot(a - prev.x, b - prev.y)
                    ? curr
                    : prev,
            { x: 0, y: 0 }
        );
        return grid.fromVector(a - closestPoint.x, b - closestPoint.y).length();
    } else {
        return grid.fromVector(a - relativeX, b - relativeY).length();
    }
}

export abstract class Grid {
    protected _grid: { [key: number]: { [key: number]: Point } };
    public info: GridInfo;
    // No width or height. This grid is infinite in both directions.
    private _subs: ((point: Point[]) => void)[] = [];

    constructor(grid?: { [key: number]: { [key: number]: Point } }, info?: GridInfo) {
        this._grid = grid || {} as { [key: number]: { [key: number]: Point } };
        this.info = info || {} as GridInfo;
    }

    protected callAll() {
        const pts = this.getAllPoints();
        this._subs.forEach(sub => sub(pts));
    }

    public subscribe(subOwO: (point: Point[]) => void) {
        subOwO(this.getAllPoints());
        this._subs.push(subOwO)
        return () => this.unsubscribe(subOwO);
    }

    public unsubscribe(subOwO: (point: Point[]) => void) {
        const index = this._subs.indexOf(subOwO);
        if (index > -1) {
            this._subs.splice(index, 1);
        }
    }

    public getAllPoints(): Point[] {
        const points: Point[] = [];
        for (let x in this._grid) {
            for (let y in this._grid[x]) {
                points.push(this._grid[x][y]);
            }
        }
        return points;
    }

    public getPoint(x: number, y: number): Point {
        let col = this._grid[x];
        if (col) {
            let pnt = col[y];
            if (pnt) {
                return pnt as Point;
            } else {
                col[y] = { x, y };
                this.callAll();
                return col[y];
            }
        } else {
            col = this._grid[x] = {};
            col[y] = { x, y };
            this.callAll();
            return col[y];
        }
    }

    public fromMousePos(x: number, y: number): Point {
        return this.fromVectorPoint(this.applyFromVector(new Vec(x, y)));
    }

    public applyToVector(vec: Vec): Vec {
        return vec.add(this.info.offset).scale(this.info.size);
    }

    public applyToNumX(n: number): number {
        return ( + this.info.offset.x) * this.info.size;
    }

    public applyToNumY(n: number): number {
        return (n + this.info.offset.y) * this.info.size;
    }

    public applyFromVector(vec: Vec): Vec {
        return vec.scale(1/this.info.size).sub(this.info.offset);
    }

    public applyFromNumX(n: number): number {
        return n / this.info.size - this.info.offset.x;
    }

    public applyFromNumY(n: number): number {
        return n / this.info.size - this.info.offset.y;
    }

    public fromVectorPoint(point: Point): Vec {
        return this.fromVector(point.x, point.y);
    }

    public abstract fromVector(x: number, y: number): Vec;

    public toVectorPoint(point: Point): Vec {
        return this.toVector(point.x, point.y);
    }

    public abstract toVector(x: number, y: number): Vec;

    public isAjacentPoint(p1: Point, p2: Point): boolean {
        return this.isAjacent(p1.x, p1.y, p2.x, p2.y);
    }

    public isAjacentPointNum(p1: Point, x2: number, y2: number): boolean {
        return this.isAjacent(p1.x, p1.y, x2, y2);
    }

    public abstract isAjacent(x: number, y: number, x2: number, y2: number): boolean;


    public getAllInLinePoint(p1: Point, p2: Point): Point[] {
        return this.getAllInLine(p1.x, p1.y, p2.x, p2.y);
    }

    public getAllInLine(x: number, y: number, x2: number, y2: number): Point[] {
        const points: Point[] = [];
        const dx = Math.abs(x2 - x);
        const dy = Math.abs(y2 - y);
        const sx = x < x2 ? 1 : -1;
        const sy = y < y2 ? 1 : -1;
        const dxyGCD = gcd(dx, dy);
        const dx2 = dx / dxyGCD;
        const dy2 = dy / dxyGCD;
        let x3 = x;
        let y3 = y;
        for (let i = 0; i <= dxyGCD; i++) {
            points.push(this.getPoint(x3, y3));
            x3 += dx2 * sx;
            y3 += dy2 * sy;
        }
        return points;
    }

    // Todo: Make a "pattern" class that can be used to make a grid with a pattern of shapes.
    public abstract generateDefaultGrid(size: number): void;

    public setRandomMines(count: number) {
        const shapes = [...this.info.shapes];
        const mines: Shape[] = [];
        for (let i = 0; i < count; i++) {
            const index = Math.floor(Math.random() * shapes.length);
            const point = shapes[index];
            shapes.splice(index, 1);
            mines.push(point);
        }
        mines.forEach(point => point.shapeInfo.hasMine = true);
    }

    public setMineRatio(ratio: number) {
        this.setRandomMines(Math.floor(this.info.shapes.length * ratio));
    }
}

export class SquareGrid extends Grid {
    public toVector(x: number, y: number): Vec {
        return new Vec(x, -y);
    }

    public fromVector(x: number, y: number): Vec {
        return new Vec(x, -y);
    }

    public isAjacent(x: number, y: number, x2: number, y2: number): boolean {
        return (x === x2 && Math.abs(y - y2) === 1) || (y === y2 && Math.abs(x - x2) === 1);
    }

    public generateDefaultGrid(gridSize: number) {
        let halfGridSize = Math.floor(gridSize / 2);
        for (let x = -halfGridSize; x < halfGridSize + gridSize%2; x++) {
            for (let y = -halfGridSize; y < halfGridSize + gridSize%2; y++) {
                this.info.shapes.push(
                    new Shape(
                        this,
                        [
                            moveTo(x, y),
                            lineTo(x + 1, y),
                            lineTo(x + 1, y + 1),
                            lineTo(x, y + 1),
                        ]
                    )
                );
            }
        }
    }

    public generateOctogonGrid(gridSize: number) {
        let halfGridSize = Math.floor(gridSize / 2);
        let max = halfGridSize + gridSize%2;
        for (let i = -halfGridSize; i < max; i++) {
            for (let j = -halfGridSize; j < max; j++) {
                let x = i * 3;
                let y = j * 3;
                this.info.shapes.push(
                    new Shape(
                        this,
                        [
                            moveTo(x, y),
                            lineTo(x + 1, y),
                            lineTo(x + 2, y + 1),
                            lineTo(x + 2, y + 2),
                            lineTo(x + 1, y + 3),
                            lineTo(x, y + 3),
                            lineTo(x - 1, y + 2),
                            lineTo(x - 1, y + 1),
                        ]
                    ),
                );
                if (i < max - 1 && j > -halfGridSize) {
                    this.info.shapes.push(
                        new Shape(
                            this,
                            [
                                moveTo(x + 1, y),
                                lineTo(x + 2, y + 1),
                                lineTo(x + 3, y),
                                lineTo(x + 2, y - 1),
                            ]
                        ),
                    );
                }
            }
        }
    }
}

const sqrt3over2 = Math.sqrt(3) / 2;

export class HexGrid extends Grid {
    public toVector(x: number, y: number): Vec {
        return new Vec(x * sqrt3over2, -y - x * 0.5);
    }
    
    public fromVector(x: number, y: number): Vec {
        var newX = x / sqrt3over2;
        return new Vec(newX, -y-newX*0.5);
    }

    public isAjacent(x: number, y: number, x2: number, y2: number): boolean {
        const dx = x - x2;
        const dy = y - y2;
        return (dx === 0 && dy === 1) || (dx === 1 && dy === 0) || (dx === 0 && dy === -1) || (dx === -1 && dy === 0) || (dx === -1 && dy === 1) || (dx === 1 && dy === -1);
    }

    public generateDefaultGrid(gridSize: number) {
        let halfGridSize = Math.floor(gridSize / 2);
        for (let i = 0; i < gridSize * 2 - 1; i++) {
            for (
                let j = Math.max(0, gridSize - i - 1);
                j < gridSize * 2 - Math.max(1, i - gridSize + 2);
                j++
            ) {
                let x = (i - halfGridSize * 1.5) * 2 + j - halfGridSize * 2;
                let y = j - i - halfGridSize;
                this.info.shapes.push(
                    new Shape(
                        this,
                        [
                            moveTo(x, y),
                            lineTo(x + 1, y),
                            lineTo(x + 1, y + 1),
                            lineTo(x, y + 2),
                            lineTo(x - 1, y + 2),
                            lineTo(x - 1, y + 1),
                        ]
                    )
                );
            }
        }
    }

    public generateTriangleGrid(gridSize: number) {
        for (let i = 1; i < gridSize * 2 - 1; i++) {
            for (
                let y = 0;
                y < gridSize - i / 2 - 1;
                y++
            ) {
                let x = Math.floor(i / 2);
                this.info.shapes.push(
                    new Shape(
                        this,
                        [
                            moveTo(x, y),
                            ...(i % 2 ? [
                                lineTo(x + 1, y),
                                lineTo(x, y + 1),
                            ] : [
                                lineTo(x, y + 1),
                                lineTo(x - 1, y + 1),
                            ])
                        ]
                    )
                );
            }
        }
    }
}