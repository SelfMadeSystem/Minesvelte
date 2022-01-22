import type { Shape } from './shape';
import type { Grid } from "./grid";

export class ShapeCollection {
    constructor(
        public shapes: Shape[],
        public minMines: number,
        public maxMines: number
    ) {
        this.minMines = Math.max(0, this.minMines);
        this.maxMines = Math.min(this.shapes.length, this.maxMines);
        if (this.minMines > this.maxMines) {
            var temp = this.minMines;
            this.minMines = this.maxMines;
            this.maxMines = temp;
        }
    }

    public intersection(other: ShapeCollection | Shape[]): Shape[] {
        const shapes = (other instanceof ShapeCollection) ? other.shapes : other;
        return this.shapes.filter(shape => shapes.some(otherShape => shape === otherShape));
    }

    public union(other: ShapeCollection | Shape[]): Shape[] {
        const shapes = (other instanceof ShapeCollection) ? other.shapes : other;
        return [...new Set(this.shapes.concat(shapes))];
    }

    public difference(other: ShapeCollection | Shape[]): Shape[] {
        const shapes = (other instanceof ShapeCollection) ? other.shapes : other;
        return this.shapes.filter(shape => !shapes.some(otherShape => shape === otherShape));
    }

    public addToShapes() {
        this.shapes.forEach(contact => {
            contact.solver_shapeCollections.push(this);
        });
    }

    public removeFromShapes() {
        this.shapes.forEach(contact => {
            contact.solver_shapeCollections = contact.solver_shapeCollections.filter(shapeCollection => shapeCollection !== this);
        });
    }

    public get size() {
        return this.shapes.length;
    }

    public get intersectingCollections() {
        return [...new Set(this.shapes.map(shape => shape.solver_shapeCollections).reduce((a, b) => a.concat(b), []))];
    }

    public equals(other: ShapeCollection): boolean {
        return this.shapes.length === other.shapes.length && this.shapes.every(shape => other.shapes.some(otherShape => shape === otherShape));
    }
}

export class Solver {
    private grid: Grid;

    constructor(grid: Grid) {
        this.grid = grid;
    }

    public async solve() {
        while (true) {
            if (await this.solveBasic()) continue;
            if (await this.solveIntersection()) continue;
            break;
        }
    }

    private async solveBasic() {
        const shapes = this.grid.shapes;

        function sleep(ms: number=250) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        var found = false;

        for (const shape of shapes) {
            if (!shape.shapeState.noMineKnown || shape.contacts.every(contact => !contact.shapeState.unknown)) continue;
            const minesAround = shape.contacts.filter(contact => contact.shapeState.mineKnown).length;
            if (shape.number === minesAround) {
                for (const contact of shape.contacts) {
                    if (!contact.shapeState.unknown) continue;
                    contact.reveal();
                    await sleep();
                }
                found = true;
            } else if (shape.number - minesAround === shape.contacts.filter(contact => contact.shapeState.unknown).length) {
                
                for (const contact of shape.contacts) {
                    if (!contact.shapeState.unknown) continue;
                    contact.flag();
                    await sleep();
                }
                found = true;
            }
        }
        return found;
    }

    private async solveIntersection() {
        const shapes = this.grid.shapes;

        function sleep(ms: number = 250) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        var found = false;

        for (const shape of shapes) {
            if (!shape.shapeState.noMineKnown || shape.contacts.every(contact => !contact.shapeState.unknown)) continue;
            const minesAround = shape.contacts.filter(contact => contact.shapeState.mineKnown).length;
        }

        return found;
    }
}