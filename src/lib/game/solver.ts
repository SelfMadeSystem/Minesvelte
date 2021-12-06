import type { Shape } from './shape';
import type { Grid } from "./grid";

export class ShapeCollection {
    constructor(
        public shapes: Shape[],
        public minesWithin: number
    ) { }

    public intersection(other: ShapeCollection | Shape[]): Shape[] {
        const shapes = (other instanceof ShapeCollection) ? other.shapes : other;
        return this.shapes.filter(shape => shapes.some(otherShape => shape === otherShape));
    }

    public union(other: ShapeCollection | Shape[]): Shape[] {
        const shapes = (other instanceof ShapeCollection) ? other.shapes : other;
        return this.shapes.concat(shapes);
    }

    public difference(other: ShapeCollection | Shape[]): Shape[] {
        const shapes = (other instanceof ShapeCollection) ? other.shapes : other;
        return this.shapes.filter(shape => !shapes.some(otherShape => shape === otherShape));
    }

    public get size() {
        return this.shapes.length;
    }

    public get intersectingCollections() {
        return [...new Set(this.shapes.map(shape => shape.solver_shapeCollections).reduce((a, b) => a.concat(b), []))];
    }

    public equals(other: ShapeCollection): boolean {
        return this.shapes.length === other.shapes.length && this.minesWithin === other.minesWithin && this.shapes.every(shape => other.shapes.some(otherShape => shape === otherShape));
    }
}

export class Solver {
    private grid: Grid;

    constructor(grid: Grid) {
        this.grid = grid;
    }

    public solve() {
        while (true) {
            if (this.solveBasic()) continue;
            // if (this.solveWithCollections()) continue; // it don't work
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
        console.log(this.findCollections());

        var found = false;

        this.splitCollections(this.findCollections()).forEach(col => {
            if (col.minesWithin === 0) {
                col.shapes.forEach(s => s.reveal());
                found = true;
            } else if (col.minesWithin === col.size) {
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
            const collection = new ShapeCollection(shape.contacts.filter(contact => contact.shapeState.unknown), shape.number - minesAround);
            collections.push(collection);
            shape.solver_selfShapeCollection = collection;
            collection.shapes.forEach(contact => {
                contact.solver_shapeCollections.push(collection);
            });
        });
        return collections;
    }

    private splitCollections(collections: ShapeCollection[]): ShapeCollection[] {
        collections = [...collections];

        var repeat = 0;

        for (let i = 0; i < collections.length; i++) {
            const collection = collections[i];
            
            var intersections = collection.intersectingCollections;
            if (repeat > 5) break;

            yeetOut: for (const col1 of intersections) {
                const len1 = col1.size;
                for (const col2 of intersections) {
                    const len2 = col2.size;
                    const intersection = col1.intersection(col2);
                    const ilen = intersection.length;
                    const d1 = len1 - ilen;
                    const d2 = len2 - ilen;

                    if (col1.minesWithin < ilen ) {
                        if (d2 === col1.minesWithin) {
                            i--;
                            repeat++;
                            collections.splice(collections.indexOf(col1), 1);
                            collections.splice(collections.indexOf(col2), 1);
                            const new1 = new ShapeCollection(intersection, col1.minesWithin);
                            const new2 = new ShapeCollection(col2.difference(intersection), col2.minesWithin - col1.minesWithin);
                            const new3 = new ShapeCollection(col1.difference(intersection), 0);
                            col1.shapes.forEach(s => s.solver_shapeCollections.splice(s.solver_shapeCollections.indexOf(col1)));
                            col2.shapes.forEach(s => s.solver_shapeCollections.splice(s.solver_shapeCollections.indexOf(col2)));
                            new1.shapes.forEach(contact => {
                                contact.solver_shapeCollections.push(new1);
                            });
                            new2.shapes.forEach(contact => {
                                contact.solver_shapeCollections.push(new2);
                            });
                            new3.shapes.forEach(contact => {
                                contact.solver_shapeCollections.push(new3);
                            });
                            collections.push(new1);
                            collections.push(new2);
                            collections.push(new3);
                            break yeetOut;
                        }
                    }

                    if (col2.minesWithin < ilen ) {
                        if (d1 === col2.minesWithin) {
                            i--;
                            repeat++;
                            collections.splice(collections.indexOf(col1), 1);
                            collections.splice(collections.indexOf(col2), 1);
                            const new1 = new ShapeCollection(intersection, col2.minesWithin);
                            const new2 = new ShapeCollection(col1.difference(intersection), col1.minesWithin - col2.minesWithin);
                            const new3 = new ShapeCollection(col2.difference(intersection), 0);
                            col1.shapes.forEach(s => s.solver_shapeCollections.splice(s.solver_shapeCollections.indexOf(col1)));
                            col2.shapes.forEach(s => s.solver_shapeCollections.splice(s.solver_shapeCollections.indexOf(col2)));
                            new1.shapes.forEach(contact => {
                                contact.solver_shapeCollections.push(new1);
                            });
                            new2.shapes.forEach(contact => {
                                contact.solver_shapeCollections.push(new2);
                            });
                            new3.shapes.forEach(contact => {
                                contact.solver_shapeCollections.push(new3);
                            });
                            collections.push(new1);
                            collections.push(new2);
                            collections.push(new3);
                            break yeetOut;
                        }
                    }
                }
            }
        }
        return collections;
    }
}