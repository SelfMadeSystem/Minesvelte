import type { Point } from '../utils/Vec';
import type { Grid } from '../game/grid';
import type { Shape } from './shape';
import type { Icon } from '../utils/Icon';

export abstract class BasicHint {
    constructor(public readonly grid: Grid) { }
    public abstract getTextPosition(): Point;
    public abstract getText(): string;
    public getTextSize(): number {
        return 0.5;
    }
    public abstract updateContacts(): void;
    public getIcon(): Icon | null { return null; }
}

export class Hint {
    /**
     * Default verification implementation.
     * 
     * Throws if the length of the array is not equal to the length of the
     * shapes and if the amount of mines (true) in the array is not equal to
     * the amount of mines in the hint.
     * @param arr The array of booleans to verify.
     * @param hint The hint to check against the array.
     * @returns true if its a valid combination of booleans.
     */
    public static defaultVerify(arr: boolean[], hint: Hint): boolean {
        if (arr.length !== hint.shapes.length)
            throw 'The length of  arr  must be equal to hint.shapes.length';
        if (arr.reduce((prev: number, cur: boolean) => prev + Number(cur), 0) !== hint.mines)
            throw 'The number of  true  in arr must be equal to  hint.mines';
        return true;
    }

    /**
     * @param shapes The shapes in this hint
     * @param mines The amount of mines in this hint
     * @param verifyCombo Call this function to verify
     */
    constructor(public shapes: Shape[],
        public mines: number,
        public verifyCombo: (arr: boolean[]) => boolean = (arr) => Hint.defaultVerify(arr, this)
    ) {
    }

    public getMinePossibilities(): boolean[][] {
        function getPossibilities(len: number, mines: number): boolean[][] {
            if (mines === 0) {
                return [new Array(len).fill(false)];
            }
            if (len === 0) {
                return [];
            }
            var possibilities: boolean[][] = [];
            var truePossibilities: boolean[][] = getPossibilities(len - 1, mines - 1);
            var falsePossibilities: boolean[][] = getPossibilities(len - 1, mines);
            truePossibilities.forEach((p) => {
                possibilities.push([true, ...p]);
            })
            falsePossibilities.forEach((p) => {
                possibilities.push([false, ...p]);
            })
            return possibilities;
        }
        return getPossibilities(this.shapes.length, this.mines).filter(v => this.verifyCombo(v));
    }

    public estimatePossibilityCount(): number { // Uses pascal triangle
        function pascal(x: number, y: number) {
            if ((x + 1) == 1 || (y + 1) == 1 || x == y) {
                return 1;
            }
            else {
                return pascal(x - 1, y - 1) + pascal(x - 1, y);
            }
        }

        return pascal(this.shapes.length, this.mines);
    }

    public intersects(other: Hint): boolean {
        return this.shapes.some(v => other.shapes.includes(v));
    }

    public getIntersections(other: Hint): Map<Shape, [number, number]> { // [index for this, index for other]
        var intersections: Map<Shape, [number, number]> = new Map();

        this.shapes.forEach(
            (v, i) => {
                other.shapes.forEach(
                    (w, j) => {
                        if (v !== w) return;
                        intersections.set(v, [i, j]);
                    }
                )
            }
        )

        return intersections;
    }

    public setShapeState(index: number, state: boolean) {
        var shape = this.shapes[index];
        if (state) {
            shape.flag();
        } else {
            shape.reveal();
        }
    }

    public setPossibility(possibility: boolean[]) {
        possibility.forEach((b, i) => this.setShapeState(i, b))
    }
}