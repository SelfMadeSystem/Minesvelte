import type { StateType } from './shape';
import type { Grid } from "./grid";
import type { BasicHint, Hint } from './basicHint';

export class Solver {
    private sleepTime = 250;
    private grid: Grid;
    public solving = false;
    public timeout: number | null = null;
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
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        if (this.currentRejection !== null) {
            this.currentRejection("cancelled");
            this.currentRejection = null;
        }
    }

    public hint() {
        // If there are any incorrectly flagged tiles, remove them.

        const shapes = this.grid.shapes;

        let found = false;

        for (const shape of shapes) {
            if (shape.shapeState.isFlagged && !shape.shapeState.hasMine) {
                shape.flag(false);
                found = true;
            }
        }

        if (found) return;

        this.solve();
        this.cancel();
    }

    /**
     * Solves the grid.
     * 
     * @param state 
     * @param wait 
     * @param complexAndMinimize Reverse the order of the solving functions. Also tries to solve using the hints already used.
     * @returns 
     */
    public async solve(state: StateType = "shapeState", wait = true, complexAndMinimize = false, hintsUsed: BasicHint[] = []) {
        if (this.solving) return;
        this.solving = true;
        if (wait) {
            this.sleepTime = 250;
        } else {
            this.sleepTime = 0;
        }

        let order = [
            this.solveBasic,
            this.solveSingleSolution,
            this.solveMatchingSolutions,
            this.solveIntersections
        ]

        if (complexAndMinimize) {
            order = order.reverse();
        }

        while (true) {
            if (!this.solving) break; // cancelled

            try {
                let used: Hint[] = [];

                if (complexAndMinimize) { // Try to solve using the hints already used.
                    let found = false;
                    const stuff = [... new Set(hintsUsed.map(h => h.asHint()))];
                    for (const func of order) {
                        used = await func.call(this, state, stuff);
                        if (used.length > 0) {
                            // Check to see if any of the hints used are not in hintsUsed.
                            // This should never happen. Print a warning if it does.
                            for (const hint of used) {
                                if (!hintsUsed.includes(hint.basicHint)) {
                                    console.warn("Hint used that was not in hintsUsed.");
                                    console.warn(hint);
                                }
                            }
                            found = true;
                            break;
                        }
                    }

                    if (found) continue;
                }

                for (const func of order) {
                    used = await func.call(this, state, undefined, complexAndMinimize);
                    if (used.length > 0) {
                        hintsUsed.push(...used.map(h => h.basicHint).filter(h => h != undefined));
                        // console.log(func.name, used, used.map(h => h.basicHint).filter(h => h != undefined), hintsUsed);
                        break;
                    }
                }

                if (used.length > 0) continue;
            } catch (e) {
                if (e === "cancelled") {
                    console.log("cancelled");
                    return;
                }
                throw e;
            }
            break;
        }

        this.solving = false;

        console.log("hintsUsed", hintsUsed);

        hintsUsed = [...new Set(hintsUsed)];

        return { hintsUsed };
    }

    private async solveBasic(state: StateType = "shapeState", hints: Hint[] = undefined, shuffle = false) {
        if (hints === undefined) hints = this.grid.getHints();

        if (shuffle) {
            hints = hints.sort(() => Math.random() - 0.5);
        }

        let used: Hint[] = [];

        for (const hint of hints) {
            if (hint.shapes.length === 0) continue;
            if (hint.mines === 0) {
                for (const shape of hint.shapes) {
                    if (!shape[state].unknown) continue;
                    if (shape.reveal(state)) await this.sleep();
                }
                used.push(hint);
            } else if (hint.mines === hint.shapes.length) {
                for (const shape of hint.shapes) {
                    if (!shape[state].unknown) continue;
                    if (shape.flag(true, state)) await this.sleep();
                }
                used.push(hint);
            }
        }
        return used;
    }

    private async solveSingleSolution(state: StateType = "shapeState", hints: Hint[] = undefined, shuffle = false) {
        if (hints === undefined) hints = this.grid.getHints();

        if (shuffle) {
            hints = hints.sort(() => Math.random() - 0.5);
        }

        let used: Hint[] = [];

        for (const hint of hints) {
            if (hint.isTooBig()) continue;
            if (hint.shapes.length === 0) continue;
            let possibilities = hint.getMinePossibilities();

            if (possibilities.length == 1) {
                for (let i = 0; i < possibilities[0].length; i++) {
                    const p = possibilities[0][i];
                    if (hint.setShapeState(i, p, state)) await this.sleep();
                }
                used.push(hint);
            }
        }
        return used;
    }

    private async solveMatchingSolutions(state: StateType = "shapeState", hints: Hint[] = undefined, shuffle = false) {
        if (hints === undefined) hints = this.grid.getHints();

        if (shuffle) {
            hints = hints.sort(() => Math.random() - 0.5);
        }

        let used: Hint[] = [];

        for (const hint of hints) {
            if (hint.isTooBig()) continue;
            if (hint.shapes.length === 0) continue;
            let possibilities = hint.getMinePossibilities();
            if (possibilities.length <= 1) continue;

            let commonalities = Solver.getCommonalities(possibilities);

            for (let i = 0; i < commonalities.length; i++) {
                const b = commonalities[i];
                if (b) {
                    if (hint.setShapeState(i, possibilities[0][i], state)) await this.sleep();
                    used.push(hint);
                }
            }
        }
        return used;
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

    private async solveIntersections(state: StateType = "shapeState", hints: Hint[] = undefined, shuffle = false) {
        if (hints === undefined) hints = this.grid.getHints();

        const intersections = this.getIntersections(hints, shuffle);

        let used: Hint[] = [];

        let possibilities: Map<Hint, [Hint[], boolean[][]]> = new Map();

        function getPossibilities(hint: Hint): [Hint[], boolean[][]] {
            if (!possibilities.has(hint)) possibilities.set(hint, [[], hint.getMinePossibilities()]);
            return possibilities.get(hint);
        }

        for (const [h1, v] of intersections) {
            let p1 = getPossibilities(h1);
            for (const h2 of v) {
                let i = h1.getIntersections(h2);

                let p2 = getPossibilities(h2);

                let did = false;

                p1[1] = p1[1].filter(p => p2[1].some(pp => {
                    for (const [_, n] of i) {
                        if (p[n[0]] !== pp[n[1]]) {
                            did = true;
                            return false;
                        }
                    }
                    return true;
                }));

                if (did) {
                    p1[0].push(h2);
                }

                possibilities.set(h1, p1);
            }
        }

        for (const [h, p] of possibilities) {
            let p1 = p[1];
            if (p1.length === 0) continue;
            let commonalities = Solver.getCommonalities(p1);

            let p10 = p1[0];

            for (let i = 0; i < commonalities.length; i++) {
                const b = commonalities[i];
                if (b) {
                    if (h.setShapeState(i, p10[i], state)) await this.sleep();
                    used.push(h);
                    used.push(...p[0]);
                }
            }
        }

        return used;
    }

    private getIntersections(hints: Hint[] = undefined, shuffle = false): Map<Hint, Hint[]> {
        if (hints === undefined) hints = this.grid.getHints();

        if (shuffle) {
            hints = hints.sort(() => Math.random() - 0.5);
        }

        let intersections: Map<Hint, Hint[]> = new Map();

        for (const hint1 of hints) {
            if (hint1.isTooBig()) continue;
            if (hint1.shapes.length === 0) continue;
            for (const hint2 of hints) {
                if (hint1 === hint2 || hint2.isTooBig()) continue;
                if (hint2.shapes.length === 0) continue;
                if (hint1.intersects(hint2)) {
                    if (!intersections.has(hint1)) intersections.set(hint1, []);
                    intersections.get(hint1).push(hint2);
                }
            }
        }

        return intersections;
    }
}