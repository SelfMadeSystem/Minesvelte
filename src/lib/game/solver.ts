import type { StateType } from './shape';
import type { Grid } from "./grid";
import type { Hint } from './basicHint';

export class Solver {
    private sleepTime = 250;
    private grid: Grid;
    public solving = false;
    public timeout: NodeJS.Timeout | number | null = null;
    public currentRejection: ((reason?: any) => void) | null = null;

    constructor(grid: Grid) {
        this.grid = grid;
    }
    
    private sleep(ms: number = this.sleepTime) {
        if (!this.solving) {
            return Promise.reject("cancelled");
        }
        if (this.sleepTime === 0) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            this.timeout = setTimeout(resolve, ms);
            this.currentRejection = reject;
        });
    }

    public cancel() {
        this.solving = false;
        if (this.timeout !== null) {
            clearTimeout(this.timeout as NodeJS.Timeout);
            this.timeout = null;
        }
        if (this.currentRejection !== null) {
            this.currentRejection("cancelled");
            this.currentRejection = null;
        }
    }

    public hint() {
        this.solve();
        this.cancel();
    }

    public async solve(state: StateType = "shapeState", wait = true) {
        if (this.solving) return;
        this.solving = true;
        if (wait) {
            this.sleepTime = 250;
        } else {
            this.sleepTime = 0;
        }
        // this.solveIntersections(state)
        let complexity = 0;
        while (true) {
            if (!this.solving) return; // cancelled

            try {
                if (await this.solveBasic(state)) {
                    complexity = Math.max(complexity, 1);
                    continue;
                }

                if (await this.solveSingleSolution(state)) {
                    complexity = Math.max(complexity, 2);
                    continue;
                }
                if (await this.solveMatchingSolutions(state)) {
                    complexity = Math.max(complexity, 3);
                    continue;
                }
                if (await this.solveIntersections(state)) {
                    complexity = Math.max(complexity, 4);
                    continue;
                }
            } catch (e) {
                if (e === "cancelled") return;
                throw e;
            }
            break;
        }

        this.solving = false;
    }

    private async solveBasic(state: StateType = "shapeState") {
        const hints = this.grid.getHints();

        let found = false;

        for (const hint of hints) {
            // if (!hint.shapeState.noMineKnown || hint.contacts.every(contact => !contact.shapeState.unknown)) continue;
            if (hint.mines === 0) {
                for (const shape of hint.shapes) {
                    if (!shape[state].unknown) continue;
                    if (shape.reveal(state)) await this.sleep();
                }
                found = true;
            } else if (hint.mines === hint.shapes.length) {
                for (const shape of hint.shapes) {
                    if (!shape[state].unknown) continue;
                    if (shape.flag(true, state)) await this.sleep();
                }
                found = true;
            }
        }
        return found;
    }

    private async solveSingleSolution(state: StateType = "shapeState") {
        const hints = this.grid.getHints();

        let found = false;

        for (const hint of hints) {
            if (hint.isTooBig()) continue;
            let possibilities = hint.getMinePossibilities();

            if (possibilities.length == 1) {
                for (let i = 0; i < possibilities[0].length; i++) {
                    const p = possibilities[0][i];
                    if (hint.setShapeState(i, p, state)) await this.sleep();
                }
                found = true;
            }
        }
        return found;
    }

    private async solveMatchingSolutions(state: StateType = "shapeState") {
        const hints = this.grid.getHints();

        let found = false;

        for (const hint of hints) {
            if (hint.isTooBig()) continue;
            let possibilities = hint.getMinePossibilities();
            if (possibilities.length <= 1) continue;

            let commonalities = Solver.getCommonalities(possibilities);

            for (let i = 0; i < commonalities.length; i++) {
                const b = commonalities[i];
                if (b) {
                    if (hint.setShapeState(i, possibilities[0][i], state)) await this.sleep();
                    found = true;
                }
            }
        }
        return found;
    }

    private static getCommonalities(possibilities: boolean[][]): boolean[] {
        possibilities = [...possibilities];
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

        let found = false;

        let possibilities: Map<Hint, boolean[][]> = new Map();

        function getPossibilities(hint: Hint): boolean[][] {
            if (!possibilities.has(hint)) possibilities.set(hint, hint.getMinePossibilities());
            return possibilities.get(hint);
        }

        for (const [h1, v] of intersections) {
            let p1 = getPossibilities(h1);
            for (const h2 of v) {
                let i = h1.getIntersections(h2);

                let p2 = getPossibilities(h2);

                p1 = p1.filter(p => p2.some(pp => {
                    for (const [_, n] of i) {
                        if (p[n[0]] !== pp[n[1]]) return false;
                    }
                    return true;
                }))

                possibilities.set(h1, p1);
            }
        }

        for (const [h, p] of possibilities) {
            if (p.length === 0) continue;
            let commonalities = Solver.getCommonalities(p);

            let p0 = p[0];

            for (let i = 0; i < commonalities.length; i++) {
                const b = commonalities[i];
                if (b) {
                    if (h.setShapeState(i, p0[i], state)) await this.sleep();
                    found = true;
                }
            }
        }

        return found;
    }

    private getIntersections(): Map<Hint, Hint[]> {
        const hints = this.grid.getHints();

        let intersections: Map<Hint, Hint[]> = new Map();

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