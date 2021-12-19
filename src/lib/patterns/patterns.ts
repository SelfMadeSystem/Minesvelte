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

export abstract class Pattern { // Todo: Add stuff to this class and make a HexPattern and a TrianglePattern.
    constructor(
        public readonly name: string,
        public readonly parameters: string[]
    ) { }

    public abstract generateGrid(grid: Grid, parameters: unknown): void;
}

/**
 * A tile is a collection of shapes that can be tiled together to generate a grid.
 */
export class SquarePattern extends Pattern {
    constructor(
        public readonly name: string,
        public repeatDimensions: Point,
        public repeatOffset: Point | ((p: Point) => Point),
        public repeatingTiles: FunOrDef<SingleTile[]>,
        public topTiles: FunOrDef<SingleTile[]> = [],
        public bottomTiles: FunOrDef<SingleTile[]> = [],
        public leftTiles: FunOrDef<SingleTile[]> = [],
        public rightTiles: FunOrDef<SingleTile[]> = []) {
        super(name, ["Width", "Height"]);
    }

    /**
     * Generates a Grid from this Tile.
     * 
     * @param grid The grid to generate the shapes into.
     * @param parameters The dimensions of the grid to generate.
     */
    public generateGrid(grid: Grid, parameters: {Width: number, Height: number}): void {
        const { Width, Height } = parameters;
        const dimensions: Point = new Vec(Width, Height);
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
