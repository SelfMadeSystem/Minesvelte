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
        return this.shapes.length === other.shapes.length && this.minMines === other.minMines && this.maxMines === other.maxMines && this.shapes.every(shape => other.shapes.some(otherShape => shape === otherShape));
    }
}

export class Solver {
    private grid: Grid;

    constructor(grid: Grid) {
        this.grid = grid;
    }

    public solve() {
        // this.solveWithCollections();
        while (true) {
            if (this.solveBasic()) continue;
            // if (this.solveWithCollections()) continue;
            break;
        }
    }

    private solveBasic() {
        const shapes = this.grid.shapes;

        return shapes.some(shape => {
            if (!shape.shapeState.noMineKnown || shape.contacts.every(contact => !contact.shapeState.unknown)) return;
            const minesAround = shape.contacts.filter(contact => contact.shapeState.mineKnown).length;
            if (shape.number === minesAround) {
                shape.contacts.forEach(contact => {
                    contact.reveal();
                });
                return true;
            } else if (shape.number - minesAround === shape.contacts.filter(contact => contact.shapeState.unknown).length) {
                shape.contacts.forEach(contact => {
                    contact.flag();
                });
                return true;
            }
        });
    }
    
    private solveWithCollections(): boolean {
        const shapes = this.grid.shapes;
        shapes.forEach(shape => shape.solver_shapeCollections = []);

        var found = false;

        const collections = this.splitCollections(this.findCollections());
        debugger;
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
            collections.push(collection);
            // shape.solver_selfShapeCollection = collection;
            collection.addToShapes();
        });
        return collections;
    }

    private splitCollections(collections: ShapeCollection[]): ShapeCollection[] {
        collections = [...collections];

        for (let i = 0; i < collections.length; i++) {
            if (i < 0) continue;

            const collection = collections[i];
            var intersections = collection.intersectingCollections;

            for (const col1 of intersections) {
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
                    const new2 = new ShapeCollection(diff1, col1.minMines - minInInter, Math.min(diff1.length, col1.maxMines - minInInter));
                    const diff2 = col2.difference(intersection);
                    const new3 = new ShapeCollection(diff2, col2.minMines - minInInter, Math.min(diff2.length, col2.maxMines - minInInter));

                    var did = false;
                    debugger;

                    if (!collections.some(col => col.equals(new1))) {
                        collections.push(new1);
                        new1.addToShapes();
                        col1.removeFromShapes();
                        col2.removeFromShapes();
                        if (removeFromArray(collections, col1)) i--;
                        if (removeFromArray(collections, col2)) i--;
                        did = true;
                    }

                    if (!collections.some(col => col.equals(new2))) {
                        collections.push(new2);
                        new2.addToShapes();
                        col1.removeFromShapes();
                        col2.removeFromShapes();
                        if (removeFromArray(collections, col1)) i--;
                        if (removeFromArray(collections, col2)) i--;
                        did = true;
                    }

                    if (!collections.some(col => col.equals(new3))) {
                        collections.push(new3);
                        new3.addToShapes();
                        col1.removeFromShapes();
                        col2.removeFromShapes();
                        if (removeFromArray(collections, col1)) i--;
                        if (removeFromArray(collections, col2)) i--;
                        did = true;
                    }
                    if (did) break;
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