import type { Point } from './Vec';

interface RectConstructorArgs {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    x2?: number;
    y2?: number;
    point1?: Point;
    point2?: Point;
}
export class Rect {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    constructor(args: RectConstructorArgs = {}) {
        this.x = args.x || 0;
        this.y = args.y || 0;
        this.width = args.width || 0;
        this.height = args.height || 0;
        if (args.point1) {
            this.x = args.point1.x;
            this.y = args.point1.y;
            this.width = args.point2.x - args.point1.x;
            this.height = args.point2.y - args.point1.y;
        }
        if (args.point2) {
            this.x = args.point1.x;
            this.y = args.point1.y;
            this.width = args.point2.x - args.point1.x;
            this.height = args.point2.y - args.point1.y;
        }
        if (args.x2) {
            this.x = args.x;
            this.width = args.x2 - args.x;
        }
        if (args.y2) {
            this.y = args.y;
            this.height = args.y2 - args.y;
        }
    }
    get left() {
        return this.x;
    }
    get right() {
        return this.x + this.width;
    }
    get top() {
        return this.y;
    }
    get bottom() {
        return this.y + this.height;
    }
    get min() {
        return {x: this.x, y: this.y};
    }
    get max() {
        return {x: this.x + this.width, y: this.y + this.height};
    }
    get center() {
        return {x: this.x + this.width / 2, y: this.y + this.height / 2};
    }
    get centerX() {
        return this.x + this.width / 2;
    }
    get centerY() {
        return this.y + this.height / 2;
    }
    get area() {
        return this.width * this.height;
    }
    get aspectRatio() {
        return this.width / this.height;
    }
}