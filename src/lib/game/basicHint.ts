import type { Point } from '../utils/Vec';
import type { Grid } from '../game/grid';
import type { Shape } from './shape';

export abstract class BasicHint {
    constructor(public readonly grid: Grid) { }
    public abstract getTextPosition(): Point;
    public abstract getText(): string;
    public getTextSize(): number {
        return 0.5;
    }
    public abstract updateContacts(): void;
}

export class Hint {
    constructor(public shapes: Shape[],
        public minMines: number,
        public maxMines: number) { }
}