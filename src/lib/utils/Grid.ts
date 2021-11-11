import Vec from "../utils/Vec";
import type { Point } from "../utils/Vec";
import { gcd } from "./Math";
import { windowSize } from "../stores";
import { lineTo, moveTo, Shape } from "./Shape";
import { Matrix2D } from "./Matrix2D";

export class GridPoint implements Point {
    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly shapes: Shape[] = []) {
    }
}

export function getMousePoint(x: number, y: number, grid: Grid): Point {
    const relativeX = x - windowSize.width / 2;
    const relativeY = y - windowSize.height / 2;
    const vec1 = grid.applyInverseMatrix(new Vec(relativeX, relativeY));
    const { x: a, y: b } = grid.fromVector({
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
    const relativeX = x - windowSize.width / 2;
    const relativeY = y - windowSize.height / 2;
    const vec1 = grid.applyInverseMatrix(new Vec(relativeX, relativeY));
    const { x: a, y: b } = grid.fromVector({
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
        return grid.fromVector({x: a - closestPoint.x, y: b - closestPoint.y}).length();
    } else {
        return grid.fromVector({x: a - relativeX, y: b - relativeY}).length();
    }
}

/*
getShapeCountWithMines(): number {
        return this.shapes.reduce((prev, curr) => prev + (curr.shapeInfo.hasMine ? 1 : 0), 0);
    }

    getFlaggedShapeCount(): number {
        return this.shapes.reduce((prev, curr) => prev + (curr.shapeInfo.isFlagged ? 1 : 0), 0);
    }
*/

export abstract class Grid {
    protected _grid: { [key: number]: { [key: number]: GridPoint } };
    protected _allPoints: GridPoint[] = [];
    public shapes: Shape[] = [];
    public callbacks: ((grid: Grid) => void)[] = [];
    public tranformMatrix: Matrix2D = Matrix2D.identity();
    private _subs: ((point: Point[]) => void)[] = [];

    constructor(grid?: { [key: number]: { [key: number]: GridPoint } }) {
        this._grid = grid || {} as { [key: number]: { [key: number]: GridPoint } };
    }

    protected notify() {
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

    public getAllPoints(): GridPoint[] {
        return this._allPoints;
    }

    public getPoint(x: number, y: number): GridPoint {
        let col = this._grid[x];
        if (col) {
            let pnt = col[y];
            if (pnt) {
                return pnt;
            }
        } else {
            col = this._grid[x] = {};
        }
        col[y] = new GridPoint(x, y);
        this._allPoints.push(col[y]);
        this.notify();
        return col[y];
    }

    public fromMousePos(x: number, y: number): Point {
        return this.fromVector(this.applyInverseMatrix(new Vec(x, y)));
    }

    public applyMatrix(vec: Point): Point {
        return this.tranformMatrix.apply(vec);
    }

    public applyInverseMatrix(vec: Point): Point {
        return this.tranformMatrix.applyInverse(vec);
    }

    public abstract fromVector({x, y}: Point): Vec;

    public abstract toVector({x, y}: Point): Vec;

    public abstract isAdjacent({x: x1, y: y1}: Point, {x: x2, y: y2}: Point): boolean;

    public getAllInLine({x: x1, y: y1}: Point, {x: x2, y: y2}: Point): GridPoint[] {
        const points: GridPoint[] = [];
        const dx = Math.abs(x1 - x2);
        const dy = Math.abs(y1 - y2);
        const sx = x1 < x2 ? 1 : -1;
        const sy = y1 < y2 ? 1 : -1;
        const dxyGCD = gcd(dx, dy);
        const dx2 = dx / dxyGCD;
        const dy2 = dy / dxyGCD;
        let x3 = x1;
        let y3 = y1;
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
        const shapes = [...this.shapes];
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
        this.setRandomMines(Math.floor(this.shapes.length * ratio));
    }
}

export class SquareGrid extends Grid {
    public toVector({x, y}: Point): Vec {
        return new Vec(x, -y);
    }

    public fromVector({x, y}: Point): Vec {
        return new Vec(x, -y);
    }

    public isAdjacent({x: x1, y: y1}: Point, {x: x2, y: y2}: Point): boolean {
        return (x1 === x2 && Math.abs(y1 - y2) === 1) || (y1 === y2 && Math.abs(x1 - x2) === 1);
    }

    public generateDefaultGrid(gridSize: number) {
        let halfGridSize = Math.floor(gridSize / 2);
        for (let x = -halfGridSize; x < halfGridSize + gridSize % 2; x++) {
            for (let y = -halfGridSize; y < halfGridSize + gridSize % 2; y++) {
                this.shapes.push(
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
        let max = halfGridSize + gridSize % 2;
        for (let i = -halfGridSize; i < max; i++) {
            for (let j = -halfGridSize; j < max; j++) {
                let x = i * 3;
                let y = j * 3;
                this.shapes.push(
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
                    this.shapes.push(
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
    public toVector({x, y}: Point): Vec {
        return new Vec(x * sqrt3over2, -y - x * 0.5);
    }

    public fromVector({x, y}: Point): Vec {
        var newX = x / sqrt3over2;
        return new Vec(newX, -y - newX * 0.5);
    }

    public isAdjacent({x: x1, y: y1}: Point, {x: x2, y: y2}: Point): boolean {
        const dx = x1 - x2;
        const dy = y1 - y2;
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
                this.shapes.push(
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
                this.shapes.push(
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