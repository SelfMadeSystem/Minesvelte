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

function sleep(ms: number = 250) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class Solver {
    private grid: Grid;

    constructor(grid: Grid) {
        this.grid = grid;
    }

    public async solve() {
        while (true) {
            if (await this.solveBasic()) continue;
            if (await this.solveSingleSolution()) continue;
            if (await this.solveMatchingSolutions()) continue;
            // if (await this.solveIntersection()) continue;
            break;
        }
    }

    private async solveBasic() {
        const hints = this.grid.getHints();
        console.log(hints);

        var found = false;

        for (const hint of hints) {
            // if (!hint.shapeState.noMineKnown || hint.contacts.every(contact => !contact.shapeState.unknown)) continue;
            if (hint.mines === 0) {
                for (const shape of hint.shapes) {
                    if (!shape.shapeState.unknown) continue;
                    shape.reveal();
                    await sleep();
                }
                found = true;
            } else if (hint.mines === hint.shapes.length) {
                for (const shape of hint.shapes) {
                    if (!shape.shapeState.unknown) continue;
                    shape.flag();
                    await sleep();
                }
                found = true;
            }
        }
        return found;
    }

    private async solveSingleSolution() {
        const hints = this.grid.getHints();

        var found = false;

        for (const hint of hints) {
            if (hint.estimatePossibilityCount() > 32) continue;
            let possibilities = hint.getMinePossibilities();

            if (possibilities.length == 1) {
                for (let i = 0; i < possibilities[0].length; i++) {
                    const p = possibilities[0][i];
                    hint.setShapeState(i, p)
                    await sleep();
                }
                found = true;
            }
        }
        return found;
    }

    private async solveMatchingSolutions() {
        const hints = this.grid.getHints();

        var found = false;

        for (const hint of hints) {
            if (hint.estimatePossibilityCount() > 32) continue;
            let possibilities = hint.getMinePossibilities();
            if (possibilities.length <= 1) continue;

            let matching = new Array<boolean>(hint.shapes.length).fill(true);
            let checkAgainst = possibilities[0];

            possibilities.shift();
            possibilities.forEach((p) => {
                p.forEach((b, i) => {
                    if (checkAgainst[i] !== b) {
                        matching[i] = false;
                    }
                })
            })

            console.log(matching, [checkAgainst, ...possibilities]);

            for (let i = 0; i < matching.length; i++) {
                const b = matching[i];
                if (b) {
                    hint.setShapeState(i, checkAgainst[i]);
                    await sleep();
                    found = true;
                }
            }
        }
        return found;
    }

    private async solveIntersection() {
        const hints = this.grid.getHints();

        function sleep(ms: number = 250) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        var found = false;

        return found;
    }
}