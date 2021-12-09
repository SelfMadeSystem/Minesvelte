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
        // this.solveWithCollections();
        while (true) {
            if (await this.solveBasic()) continue; // fixme
            // if (this.solveWithCollections()) continue;
            break;
        }
    }

    private async solveBasic() {
        const shapes = this.grid.shapes;

        function sleep(ms: number=250) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        var fuck = false;

        for (const shape of shapes) {
            if (!shape.shapeState.noMineKnown || shape.contacts.every(contact => !contact.shapeState.unknown)) continue;
            const minesAround = shape.contacts.filter(contact => contact.shapeState.mineKnown).length;
            if (shape.number === minesAround) {
                for (const contact of shape.contacts) {
                    if (!contact.shapeState.unknown) continue;
                    contact.reveal();
                    await sleep();
                }
                fuck = true;
            } else if (shape.number - minesAround === shape.contacts.filter(contact => contact.shapeState.unknown).length) {
                
                for (const contact of shape.contacts) {
                    if (!contact.shapeState.unknown) continue;
                    contact.flag();
                    await sleep();
                }
                fuck = true;
            }
        }
        return fuck;
    }

    private solveWithCollections(): boolean {
        const shapes = this.grid.shapes;
        shapes.forEach(shape => shape.solver_shapeCollections = []);

        var found = false;

        const collections = this.splitCollections(this.findCollections());
        collections.forEach(col => {
            if (col.size === 0) return;
            if (col.maxMines === 0) {
                col.shapes.forEach(s => s.reveal());
                found = true;
            } else if (col.minMines === col.size && col.maxMines === col.size) {
                col.shapes.forEach(s => s.flag());
                found = true;
            }
        });
        return found;
    }

    private findCollections(): ShapeCollection[] {
        const shapes = this.grid.shapes;
        const collections: ShapeCollection[] = [];
        shapes.forEach(shape => {
            if (!shape.shapeState.noMineKnown || shape.contacts.every(contact => !contact.shapeState.unknown)) return;
            const minesAround = shape.contacts.filter(contact => contact.shapeState.mineKnown).length;
            const collection = new ShapeCollection(shape.contacts.filter(contact => contact.shapeState.unknown), shape.number - minesAround, shape.number - minesAround);
            if (!collections.some(col => col.equals(collection))) {
                collections.push(collection);
                // shape.solver_selfShapeCollection = collection;
                collection.addToShapes();
            } else {
                const col = collections.find(col => col.equals(collection));
                if (col.minMines < collection.minMines) col.minMines = collection.minMines;
                if (col.maxMines > collection.maxMines) col.maxMines = collection.maxMines;
               // shape.solver_selfShapeCollection = collections.find(col => col.equals(collection));
            }
        });
        return collections;
    }

    private splitCollections(collections: ShapeCollection[]): ShapeCollection[] {
        collections = [...collections];

        for (let i = 0; i < collections.length; i++) {
            if (i < 0) continue;

            const collection = collections[i];
            var intersections = collection.intersectingCollections;

            const col1 = collection;
            const len1 = col1.size;
            if (col1.minMines === 0 && col1.maxMines === 0) continue;
            if (col1.minMines === len1 && col1.maxMines === len1) continue;
            for (const col2 of intersections) {
                if (col1 === col2) continue;
                const len2 = col2.size;
                if (col2.minMines === 0 && col2.maxMines === 0) continue;
                if (col2.minMines === len2 && col2.maxMines === len2) continue;
                const intersection = col1.intersection(col2);
                const ilen = intersection.length;
                const d1 = len1 - ilen;
                const d2 = len2 - ilen;

                const minInInter = Math.min(intersection.length, Math.max(0, col1.minMines - d1, col2.minMines - d2));
                const maxInInter = Math.min(intersection.length, Math.max(col1.maxMines, col2.maxMines));

                // Fixme: idk what the max should be
                const new1 = new ShapeCollection(intersection, minInInter, maxInInter);
                const diff1 = col1.difference(intersection);
                const new2 = new ShapeCollection(diff1, col1.minMines - maxInInter, Math.min(diff1.length, col1.maxMines - minInInter));
                const diff2 = col2.difference(intersection);
                const new3 = new ShapeCollection(diff2, col2.minMines - maxInInter, Math.min(diff2.length, col2.maxMines - minInInter));

                var did = false;

                function doStuff(n: ShapeCollection) {
                    if (!collections.some(col => col.equals(n))) {
                        collections.push(n);
                        n.addToShapes();
                        col1.removeFromShapes();
                        col2.removeFromShapes();
                        if (removeFromArray(collections, col1)) i--;
                        if (removeFromArray(collections, col2)) i--;
                        did = true;
                    } else {
                        const col = collections.find(col => col.equals(n));
                        if (col.minMines < n.minMines) col.minMines = n.minMines;
                        if (col.maxMines > n.maxMines) col.maxMines = n.maxMines;
                    }
                }
                doStuff(new1);
                doStuff(new2);
                doStuff(new3);
                if (did) {
                    break;
                }
            }
        }
        return collections;

        function removeFromArray(array: ShapeCollection[], element: ShapeCollection) {
            const index = array.indexOf(element);
            if (index === -1) return false;
            array.splice(index, 1);
            return true;
        }
    }
}