import type { Shape, StateType } from './shape';
import type { Grid } from "./grid";
import type { Hint } from './basicHint';

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

    public async solve(state: StateType = "shapeState") {
        // this.solveIntersections(state)
        while (true) {
            if (await this.solveBasic(state)) continue;
            if (await this.solveSingleSolution(state)) continue;
            if (await this.solveMatchingSolutions(state)) continue;
            if (await this.solveIntersections(state)) continue;
            break;
        }
    }

    private async solveBasic(state: StateType = "shapeState") {
        const hints = this.grid.getHints();
        console.log(hints);

        var found = false;

        for (const hint of hints) {
            // if (!hint.shapeState.noMineKnown || hint.contacts.every(contact => !contact.shapeState.unknown)) continue;
            if (hint.mines === 0) {
                for (const shape of hint.shapes) {
                    if (!shape[state].unknown) continue;
                    shape.reveal();
                    await sleep();
                }
                found = true;
            } else if (hint.mines === hint.shapes.length) {
                for (const shape of hint.shapes) {
                    if (!shape[state].unknown) continue;
                    shape.flag();
                    await sleep();
                }
                found = true;
            }
        }
        return found;
    }

    private async solveSingleSolution(state: StateType = "shapeState") {
        const hints = this.grid.getHints();

        var found = false;

        for (const hint of hints) {
            if (hint.isTooBig()) continue;
            let possibilities = hint.getMinePossibilities();

            if (possibilities.length == 1) {
                for (let i = 0; i < possibilities[0].length; i++) {
                    const p = possibilities[0][i];
                    hint.setShapeState(i, p, state)
                    await sleep();
                }
                found = true;
            }
        }
        return found;
    }

    private async solveMatchingSolutions(state: StateType = "shapeState") {
        const hints = this.grid.getHints();

        var found = false;

        for (const hint of hints) {
            if (hint.isTooBig()) continue;
            let possibilities = hint.getMinePossibilities();
            if (possibilities.length <= 1) continue;

            let commonalities = Solver.getCommonalities(possibilities);

            for (let i = 0; i < commonalities.length; i++) {
                const b = commonalities[i];
                if (b) {
                    hint.setShapeState(i, possibilities[0][i], state);
                    await sleep();
                    found = true;
                }
            }
        }
        return found;
    }

    private static getCommonalities(possibilities: boolean[][]): boolean[] {
        if (possibilities.length === 0) return [];
        let matching = new Array<boolean>(possibilities[0].length).fill(true);
        let checkAgainst = possibilities[0];

        possibilities.shift();
        possibilities.forEach((p) => {
            p.forEach((b, i) => {
                if (checkAgainst[i] !== b) {
                    matching[i] = false;
                }
            })
        })

        return matching;
    }

    private async solveIntersections(state: StateType = "shapeState") {
        const intersections = this.getIntersections();

        var found = false;

        for (const [h1, v] of intersections) {
            let p1 = h1.getMinePossibilities();
            for (const h2 of v) {
                let p2 = h2.getMinePossibilities();
                let i = h1.getIntersections(h2);

                let filter = p1.filter(p => p2.some(pp => {
                    for (const [_, n] of i) {
                        if (p[n[0]] !== pp[n[1]]) return false;
                    }
                    return true;
                }))

                let commonalities = Solver.getCommonalities(filter);

                for (let i = 0; i < commonalities.length; i++) {
                    const b = commonalities[i];
                    if (b) {
                        h1.setShapeState(i, filter[0][i], state);
                        await sleep();
                        found = true;
                    }
                }
            }
        }

        return found;
    }

    private getIntersections(): Map<Hint, Hint[]> {
        const hints = this.grid.getHints();

        var intersections: Map<Hint, Hint[]> = new Map();

        for (const hint1 of hints) {
            if (hint1.isTooBig()) continue;
            for (const hint2 of hints) {
                if (hint1 === hint2 || hint2.isTooBig()) continue;
                if (hint1.intersects(hint2)) {
                    if (!intersections.has(hint1)) intersections.set(hint1, []);
                    intersections.set(hint1, [...intersections.get(hint1), hint2]);
                }
            }
        }

        return intersections;
    }
}