import Vec from "../utils/Vec";
import type { Point } from "../utils/Vec";
import { windowSize } from "../stores";
import { lineTo, moveTo, Shape } from "./shape";
import type { MineLine } from "./mineLine";
import { Notifier, ValueNotifier } from "../utils/Notifier";
import { strokeColors } from "../utils/Colors";
import type { SpecificColors } from "../utils/Colors"
import { Hint } from "./basicHint";
import { Solver } from "./solver";
import { HistoryProcessor } from "./history";
import type { MainMenuNewGameOptions } from "../utils/Events";

export abstract class Grid {
    public shapes: Shape[] = [];
    public mineLines: MineLine[] = [];
    public transformScaleAdjust: ValueNotifier<number> = new ValueNotifier(1);
    public transformScale: ValueNotifier<number> = new ValueNotifier(1);
    public transformPosition: ValueNotifier<Point> = new ValueNotifier(new Vec());
    public transformPositionAdjust: ValueNotifier<Point> = new ValueNotifier(new Vec());
    public notifyShapeStateChange: Notifier<Shape> = new Notifier();
    public shapeId: number = 0;
    public history: HistoryProcessor = new HistoryProcessor(this);

    constructor() {
    }

    private _shapesByColor: { [key in SpecificColors]?: Shape[] };

    public shapesByColor(): { [key in SpecificColors]?: Shape[] } {
        if (this._shapesByColor) {
            return this._shapesByColor;
        }
        let shapes = new Map();
        this.shapes.forEach(shape => {
            if (!shapes.get(shape.shapeState.color)) {
                shapes.set(shape.shapeState.color, []);
            }
            shapes.get(shape.shapeState.color).push(shape);
        });
        shapes = new Map([...shapes.entries()].sort((a, b) => strokeColors.indexOf(a[0]) - strokeColors.indexOf(b[0])))
        return this._shapesByColor = Object.fromEntries(shapes);
    }

    public resetShapes(options: MainMenuNewGameOptions) {
        this.shapes.forEach((shape) => {
            shape.adjacentShapesNumber = options.connectedNumber;
            shape.shapeState.isFlagged = false;
            shape.shapeState.hasMine = false;
            shape.shapeState.isRevealed = false;
            shape.shapeStateNotify.unsubscribeAll();
            shape.shapeStateNotify.subscribe(() => {
                this.notifyShapeStateChange.notify(shape);
            });
        });
        this.history.reset();

        if (options.minePercent) {
            this.setMineRatio(options.mineCount / 100);
        } else {
            this.setRandomMines(options.mineCount);
        }
    }

    public fromMousePos(x: number, y: number): Point {
        const widthOrHeight = windowSize.width > windowSize.height;
        const rX = widthOrHeight ? windowSize.width - windowSize.height : 0;
        const rY = widthOrHeight ? 0 : windowSize.height - windowSize.width;
        return this.fromVector(
            this.inverseScale(
                new Vec(x, y)
                    .sub(this.transformPosition.value)
                    .sub(new Vec(rX, rY))
                    .scale(1 / (widthOrHeight ? windowSize.height : windowSize.width * 100))
            )
        ).sub(this.transformPositionAdjust.value);
    }

    public scale(point: Point): Point {
        return Vec.from(point).scale(this.transformScaleAdjust.value);
    }

    public inverseScale(point: Point): Point {
        return Vec.from(point).scale(1 / this.transformScaleAdjust.value);
    }

    public transform(point: Point): Point {
        return Vec.from(point).scale(this.transformScaleAdjust.value).add(this.transformPosition.value);
    }

    public inverseTransform(point: Point): Point {
        return Vec.from(point).sub(this.transformPosition.value).scale(1 / this.transformScaleAdjust.value);
    }

    private minMax: { min: Point, max: Point };
    public getMinMax(): { min: Point, max: Point } {
        if (!this.minMax) {
            return this.minMax = this.shapes.reduce(
                (prev, curr) => {
                    const min = curr.bounds.min;
                    const max = curr.bounds.max;
                    return {
                        min: {
                            x: Math.min(prev.min.x, min.x),
                            y: Math.min(prev.min.y, min.y),
                        },
                        max: {
                            x: Math.max(prev.max.x, max.x),
                            y: Math.max(prev.max.y, max.y),
                        },
                    };
                },
                { min: { x: Infinity, y: Infinity }, max: { x: -Infinity, y: -Infinity } }
            );
        } else {
            return this.minMax;
        }
    }

    private minMaxVector: { min: Point, max: Point };
    public getMinMaxAsVector(): { min: Point, max: Point } {
        if (!this.minMaxVector) {
            return this.minMax = this.shapes.reduce(
                (prev, curr) => {
                    const min = this.toVector(curr.bounds.min);
                    const max = this.toVector(curr.bounds.max);
                    return {
                        min: {
                            x: Math.min(prev.min.x, min.x),
                            y: Math.min(prev.min.y, min.y),
                        },
                        max: {
                            x: Math.max(prev.max.x, max.x),
                            y: Math.max(prev.max.y, max.y),
                        },
                    };
                },
                { min: { x: Infinity, y: Infinity }, max: { x: -Infinity, y: -Infinity } }
            );
        } else {
            return this.minMaxVector;
        }
    }

    public getCenter(): Point {
        const { min, max } = this.getMinMaxAsVector();
        return { x: (min.x + max.x) / 2, y: (min.y + max.y) / 2 };
    }

    public getScale(): number {
        const { min, max } = this.getMinMaxAsVector();
        return Math.max(max.x - min.x, max.y - min.y);
    }

    public centerOnScreen() {
        const { x, y } = this.getCenter();
        const scale = this.getScale();
        this.transformScaleAdjust.value = 1 / Math.pow(scale, 0.8) * 50;
        this.transformPositionAdjust.value = {
            x: -x,
            y: -y,
        };
    }

    public abstract toVector({ x, y }: Point): Vec;

    public abstract fromVector({ x, y }: Point): Vec;

    public abstract isAdjacent(a: Point, b: Point): boolean;

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
        mines.forEach(point => point.shapeState.hasMine = true);
        return count;
    }

    public setMineRatio(ratio: number) {
        return this.setRandomMines(Math.floor(this.shapes.length * ratio));
    }

    public getMinesCount() {
        return this.shapes.filter(m => m.shapeState.hasMine).length;
    }

    public getMinesLeft() {
        return this.getMinesCount() - this.shapes.filter(m => (m.shapeState.isRevealed && m.shapeState.hasMine) || m.shapeState.isFlagged).length
    }

    public getHints(): Hint[] {
        return [
            ...this.getShapeHints(),
            ...this.getColorHints(),
            ...this.getLineHints(),
        ].filter(a => a.shapes.length > 0);
    }

    private getShapeHints(): Hint[] {
        return this.shapes.filter(s => s.solverState.noMineKnown).map(s => s.asHint())
    }

    private getColorHints(): Hint[] {
        let hints: Hint[] = [];
        let sbc = this.shapesByColor();
        for (const key in sbc) {
            if (Object.prototype.hasOwnProperty.call(sbc, key)) {
                let shapes: Shape[] = sbc[key];
                shapes = shapes.filter(s => s.solverState.unknown)
                if (shapes.length > 0) {
                    hints.push(new Hint(shapes, shapes.reduce((a, s) => a + Number(s.solverState.hasMine), 0)));
                }
            }
        }
        return hints;
    }

    private getLineHints(): Hint[] {
        return this.mineLines.map(l => l.asHint());
    }

    public async makeSolvable() { // Reveals shapes until it becomes solvable
        let solver = new Solver(this);

        await solver.solve("solverState", false);

        const isSolved = () => {
            return this.shapes.every((s) => !s.solverState.unknown || !s.shapeState.unknown);
        }

        while (!isSolved()) {
            let shs = this.getShapeHints().filter(a => a.shapes.length > 0);
            let v = shs.length === 0;
            if (v) shs = this.getColorHints().filter(a => a.shapes.length > 0);
            let sh = shs[Math.floor(Math.random() * shs.length)];
            let l = v ? sh.shapes.filter(s => !s.shapeState.hasMine) : sh.shapes;
            let s = l[Math.floor(Math.random() * l.length)];
            if (s === undefined) {
                throw "????"
            }
            if (s.shapeState.hasMine) {
                s.flag()
            } else {
                s.reveal();
            }

            await solver.solve("solverState", false);
        }

        this.shapes.forEach(s => s.solverState.reset());
    }
}

export class SquareGrid extends Grid {
    public toVector({ x, y }: Point): Vec {
        return new Vec(x, -y);
    }

    public fromVector({ x, y }: Point): Vec {
        return new Vec(x, -y);
    }

    public isAdjacent({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point): boolean {
        return (x1 === x2 && Math.abs(y1 - y2) === 1) || (y1 === y2 && Math.abs(x1 - x2) === 1);
    }

    public generateDefaultGrid(gridSize: number) {
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                let shape = new Shape(
                    this,
                    [
                        moveTo(x, y),
                        lineTo(x + 1, y),
                        lineTo(x + 1, y + 1),
                        lineTo(x, y + 1),
                    ]
                )
                shape.A_position = { x, y };
                this.shapes.push(
                    shape
                );
            }
        }
    }

    public generateRectGrid(sizeX: number, sizeY: number) {
        for (let x = 0; x < sizeX; x++) {
            for (let y = 0; y < sizeY; y++) {
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
    public toVector({ x, y }: Point): Vec {
        return new Vec(x * sqrt3over2, -y - x * 0.5);
    }

    public fromVector({ x, y }: Point): Vec {
        let newX = x / sqrt3over2;
        return new Vec(newX, -y - newX * 0.5);
    }

    public isAdjacent({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point): boolean {
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

export class HexGridFlipped extends HexGrid {
    public toVector({ x, y }: Point): Vec {
        return new Vec(-x - y * 0.5, -y * sqrt3over2);
    }

    public fromVector({ x, y }: Point): Vec {
        let newY = y / sqrt3over2;
        return new Vec(-x - newY * 0.5, -newY);
    }
}