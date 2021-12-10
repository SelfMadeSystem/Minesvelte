import type { Point } from '../utils/Vec';
import type { Grid } from '../game/grid';

export abstract class BasicHint {
    constructor(public readonly grid: Grid) {}
    public abstract getTextPosition(): Point;
    public abstract getText(): string;
    public abstract updateContacts(): void;
}