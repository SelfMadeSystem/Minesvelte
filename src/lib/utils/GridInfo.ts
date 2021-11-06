import type { Shape } from "./Shape";
import type Vec from "./Vec";

// Move to Grid.ts as it is a Grid specific class
export interface GridInfo {
    size: number;
    offset: Vec;
    shapes: Shape[];
}
