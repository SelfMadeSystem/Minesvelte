import type { Grid } from '../game/grid';
import { lineTo, moveTo, Shape, ShapePoint } from '../game/shape';
import { Vec } from '../utils/Vec';
import type { Point } from '../utils/Vec';

/**
 * A SingleTile is an abstract shape that can be transformed into a Shape.
 */
export class SingleTile {
    public readonly points: ShapePoint[]

    constructor(points: ShapePoint[]) {
        this.points = points;
    }

    /**
     * Generates a shape from this SingleTile.
     * 
     * @param grid The grid to generate the shape into.
     * @param pos The position to place the shape at.
     */
    public toShape(grid: Grid, pos: Point): Shape {
        const points: ShapePoint[] = [];
        for (const shape of this.points) {
            const clone = shape.clone();
            clone.x += pos.x;
            clone.y += pos.y;
            points.push(clone);
        }
        return new Shape(grid, points);
    }
}

type Fun<T> = ((p: Point, d: Point) => T);
type FunOrDef<T> = T | Fun<T>;

function getFunOrDef<T>(p: Point, d: Point, value: FunOrDef<T>, def: ((p: Point, d: Point, v: T) => T) = ({ }, { }, v) => (v)): T {
    return value instanceof Function ? value(p, d) : def(p, d, value);
}

/**
 * A tile is a collection of shapes that can be tiled together to generate a grid.
 */
export class Tile {
    constructor(
        public repeatDimensions: Point,
        public repeatOffset: Point | ((p: Point) => Point),
        public repeatingTiles: FunOrDef<SingleTile[]>,
        public topTiles: FunOrDef<SingleTile[]> = [],
        public bottomTiles: FunOrDef<SingleTile[]> = [],
        public leftTiles: FunOrDef<SingleTile[]> = [],
        public rightTiles: FunOrDef<SingleTile[]> = []) {
    }

    /**
     * Generates a Grid from this Tile.
     * 
     * @param grid The grid to generate the shapes into.
     * @param dimensions The dimensions of the grid to generate.
     */
    public generateGrid(grid: Grid, dimensions: Point): void {
        for (let y = 0; y < dimensions.y; y++) {
            for (let x = 0; x < dimensions.x; x++) {
                grid.shapes.push(...this.generateShapes(grid, x, y, dimensions));
            }
        }
    }

    /**
     * Generates a single set of shapes from this Tile.
     * 
     * @param grid The grid to generate the shapes into.
     * @param x The x coordinate of the tiles.
     * @param y The y coordinate of the tiles.
     * @param dimensions The dimensions of the grid to generate.
     */
    public generateShapes(grid: Grid, x: number, y: number, dimensions: Point): Shape[] {
        const shapes: Shape[] = [];
        const pos: Point = new Vec(x, y).mul(this.repeatDimensions).add(getFunOrDef({ x, y }, dimensions, this.repeatOffset, (p, { }, v) => new Vec(p.y, p.x).mul(v)));
        function _(tiles: FunOrDef<SingleTile[]>): void {
            for (const shape of getFunOrDef({ x, y }, dimensions, tiles)) {
                shapes.push(shape.toShape(grid, pos));
            }
        }
        _(this.repeatingTiles);
        if (x === 0) {
            _(this.leftTiles);
        }
        if (x === dimensions.x - 1) {
            _(this.rightTiles);
        }
        if (y === 0) {
            _(this.topTiles);
        }
        if (y === dimensions.y - 1) {
            _(this.bottomTiles);
        }
        return shapes;
    }
}

export const basic = new Tile(
    { x: 1, y: 1 },
    { x: 0, y: 0 },
    [
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, 1),
            lineTo(0, 1),
        ])
    ]
);

export const cross = new Tile(
    { x: 2, y: 2 },
    { x: 1, y: -1 },
    [
        new SingleTile([
            moveTo(1, 1),
            lineTo(2, 1),
            lineTo(2, 2),
            lineTo(3, 2),
            lineTo(3, 3),
            lineTo(2, 3),
            lineTo(2, 4),
            lineTo(1, 4),
            lineTo(1, 3),
            lineTo(0, 3),
            lineTo(0, 2),
            lineTo(1, 2),
        ]),
    ],
);

export const tessellations1 = new Tile(
    { x: 3, y: 3 },
    { x: 0, y: 0 },
    ({ x, y }) => [
        ...(x === 0 || y === 0 ? [] : [
            new SingleTile([
                moveTo(1, 0),
                lineTo(2, 1),
                lineTo(1, 2),
                lineTo(0, 1),
            ]),
        ]),
        ...((x + y) % 2 ?
            [
                new SingleTile([
                    moveTo(2, 1),
                    lineTo(1, 2),
                    lineTo(1, 3),
                    lineTo(2, 4),
                ]),
                new SingleTile([
                    moveTo(3, 1),
                    lineTo(4, 2),
                    lineTo(4, 3),
                    lineTo(3, 4),
                ]),
                new SingleTile([
                    moveTo(2, 1),
                    lineTo(2, 4),
                    lineTo(3, 4),
                    lineTo(3, 1),
                ]),
            ]
            :
            [
                new SingleTile([
                    moveTo(1, 2),
                    lineTo(2, 1),
                    lineTo(3, 1),
                    lineTo(4, 2),
                ]),
                new SingleTile([
                    moveTo(1, 3),
                    lineTo(2, 4),
                    lineTo(3, 4),
                    lineTo(4, 3),
                ]),
                new SingleTile([
                    moveTo(1, 2),
                    lineTo(4, 2),
                    lineTo(4, 3),
                    lineTo(1, 3),
                ]),
            ]
        ),
    ],
);
