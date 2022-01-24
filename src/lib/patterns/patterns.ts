import { Grid, HexGrid, SquareGrid } from '../game/grid';
import { Shape, ShapePoint } from '../game/shape';
import { Vec } from '../utils/Vec';
import type { HexPoint, Point } from '../utils/Vec';

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

type Fun<T, P> = ((p: Point, params: P) => T);
type FunOrDef<T, P> = T | Fun<T, P>;

function getFunOrDef<T, P>(p: Point, d: P, value: FunOrDef<T, P>, def: ((p: Point, d: P, v: T) => T) = ({ }, { }, v) => (v)): T {
    return value instanceof Function ? value(p, d) : def(p, d, value);
}

export type PatternParamType = //"string" |
    "number" |
    "boolean" |
    "select";

export interface PatternParam {
    name: string;
    type: PatternParamType;
    default: any;
    min?: number;
    max?: number;
    step?: number;
    options?: string[];
}

// export interface StringParam extends PatternParam {
//     type: "string";
//     default: string;
// }

export interface NumberParam extends PatternParam {
    type: "number";
    default: number;
    min: number;
    max: number;
    step: number;
}

export interface BooleanParam extends PatternParam {
    type: "boolean";
    default: boolean;
}

export interface SelectParam extends PatternParam {
    type: "select";
    options: string[];
    default: string;
}

/**
 * A pattern is a collection of shapes that can be tiled together to generate a grid.
 */
export abstract class Pattern<P extends PatternParam[]> {
    // Todo: Add stuff to this class and make a HexPattern and a TrianglePattern.
    // Todo: Add a way to easily decide what collection of shapes to colourize. (Right now, it's essentially random.)
    constructor(
        public readonly name: string,
        public readonly parameters: P
    ) { }

    /**
     * Checks if the given parameters are valid.
     * 
     * @param parameters The parameters to check.
     * @returns null if the parameters are valid, otherwise an error message.
     */
    public checkParameters(parameters: unknown) {
        return null;
    }

    public abstract generateGrid(grid: Grid, parameters: unknown): void;

    public abstract newGrid(): Grid;
}

/**
 * A SquarePattern is a pattern that can be tiled into a square-based grid.
 * 
 * It has a width and a height.
 */
export class SquarePattern extends Pattern<[NumberParam, NumberParam]> {
    constructor(
        public readonly name: string,
        public repeatDimensions: Point,
        public repeatOffset: Point | ((p: Point) => Point),
        public repeatingTiles: FunOrDef<SingleTile[], Point>,
        public topTiles: FunOrDef<SingleTile[], Point> = [],
        public bottomTiles: FunOrDef<SingleTile[], Point> = [],
        public leftTiles: FunOrDef<SingleTile[], Point> = [],
        public rightTiles: FunOrDef<SingleTile[], Point> = []) {
        super(name, [{
            name: "Width",
            type: "number",
            default: 5,
            min: 1,
            max: 100,
            step: 1
        }, {
            name: "Height",
            type: "number",
            default: 5,
            min: 1,
            max: 100,
            step: 1
        }]);
    }

    /**
     * Generates a Grid from this Tile.
     * 
     * @param grid The grid to generate the shapes into.
     * @param parameters The dimensions of the grid to generate.
     */
    public generateGrid(grid: Grid, parameters: { Width: number, Height: number }): void {
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
        function _(tiles: FunOrDef<SingleTile[], Point>): void {
            for (const shape of getFunOrDef({ x, y }, dimensions, tiles)) {
                var s = shape.toShape(grid, pos);
                s.A_position = {x, y};
                shapes.push(s);
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

    public newGrid(): Grid {
        return new SquareGrid();
    }
}

export type HexP = { Symmetric: boolean, Width: number, BottomHeight: number, TopHeight: number };

/**
 * A HexPattern is a pattern that can be tiled into a hexagonal grid.
 * 
 * It has three dimensions: width, bottom height, and top height.
 * 
 * This has two ways to generate the grid:
 *   - The default way is to generate it where each parallel side is the same length.
 *   - The other way is to generate it symmetrically, where each horizontally opposing side is the same length, but the top and bottom sides are different lengths. (The top is  width)
 */
export class HexPattern extends Pattern<[BooleanParam, NumberParam, NumberParam, NumberParam]> {
    constructor(
        public readonly name: string,
        public repeatDimensions: Point,
        public repeatOffset: Point | ((p: Point) => Point),
        // other param is (for q, r, and s) 1 if is at positive edge, -1 if is at negative edge, 0 if not at edge.
        public readonly tiles: FunOrDef<SingleTile[], HexPoint>,
        public readonly adjust: (p: HexP) => HexP = (p) => p) {
        super(name, [{
            name: "Symmetric",
            type: "boolean",
            default: false
        }, {
            name: "Width",
            type: "number",
            default: 5,
            min: 1,
            max: 100,
            step: 1
        }, {
            name: "Bottom Height",
            type: "number",
            default: 5,
            min: 1,
            max: 100,
            step: 1
        }, {
            name: "Top Height",
            type: "number",
            default: 5,
            min: 1,
            max: 100,
            step: 1
        }]);
    }

    public generateGrid(grid: Grid, parameters: HexP): void {
        parameters = this.adjust(parameters);
        const { Symmetric, Width, BottomHeight, TopHeight } = parameters;
        const height = BottomHeight + TopHeight - 1;
        const fullWidth = Width + (Symmetric ? Math.min(BottomHeight, TopHeight) : BottomHeight) - 1;

        const edge: HexPoint = { q: 0, r: 0, s: 0 };
        for (let y = 0; y < height; y++) {
            edge.r = y == 0 ? -1 : y == height - 1 ? 1 : 0;
            let minX = Math.max(0, BottomHeight - y - 1);
            let maxX = Math.min(fullWidth, fullWidth + (Symmetric ? BottomHeight : TopHeight) - y - 1);
            for (let x = minX; x < maxX; x++) {
                edge.s = 0;
                edge.q = 0;
                if (x == minX) {
                    if (y < BottomHeight - 1) {
                        edge.q = -1;
                    } else if (y == BottomHeight - 1) {
                        edge.s = edge.q = -1;
                    } else {
                        edge.s = -1;
                    }
                }
                if (x == maxX - 1) {
                    var h = Symmetric ? BottomHeight : TopHeight;
                    if (y < h - 1) {
                        edge.s = 1;
                    } else if (y == h - 1) {
                        edge.s = edge.q = 1;
                    } else {
                        edge.q = 1;
                    }
                }

                grid.shapes.push(...this.generateShapes(grid, x, y, { q: edge.q, r: edge.r, s: edge.s }));
            }
        }
    }

    /**
     * Generates a single set of shapes from this Tile.
     * 
     * @param grid The grid to generate the shapes into.
     * @param x The x coordinate of the tiles.
     * @param y The y coordinate of the tiles.
     * @param edge -1 if is at negative edge, 1 if is at positive edge, 0 if not at edge.
     */
    public generateShapes(grid: Grid, x: number, y: number, edge: HexPoint): Shape[] {
        const shapes: Shape[] = [];
        const pos: Point = new Vec(x, y).mul(this.repeatDimensions).add(getFunOrDef({ x, y }, edge, this.repeatOffset, (p, { }, v) => new Vec(p.y, p.x).mul(v)));
        for (const shape of getFunOrDef({ x, y }, edge, this.tiles)) {
            let s = shape.toShape(grid, pos);
            s.A_hexPosition = edge;
            shapes.push(s);
        }
        return shapes;
    }

    public newGrid(): Grid {
        return new HexGrid();
    }
}