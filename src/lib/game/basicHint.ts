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
    constructor(public shapes: Shape[],
        public minMines: number,
        public maxMines: number) { }
}