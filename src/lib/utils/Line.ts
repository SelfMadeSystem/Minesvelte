import { toDeg, wrapAngle } from "./Math";
import { Vec } from "./Vec";
import type { Point } from "./Vec";


export class Line {
    public readonly v1: Vec;
    public readonly v2: Vec;
    constructor(public readonly p1: Point, public readonly p2: Point) {
        this.v1 = new Vec(p1.x, p1.y);
        this.v2 = new Vec(p2.x, p2.y);
    }

    public get dx(): number {
        return this.p2.x - this.p1.x;
    }

    public get dy(): number {
        return this.p2.y - this.p1.y;
    }

    public get rotation(): number {
        return wrapAngle(toDeg(Math.atan2(this.dy, this.dx)));
    }

    public get sizeSq(): number {
        return this.v2.distanceSq(this.v1);
    }

    public isParallel(other: Line): boolean {
        return this.rotation === other.rotation || this.rotation === wrapAngle(other.rotation + 180);
    }

    public isBetween(currPoint: Point): boolean {
        var point1 = this.p1;
        var point2 = this.p2;
        let dxc = currPoint.x - point1.x;
        let dyc = currPoint.y - point1.y;

        let dxl = point2.x - point1.x;
        let dyl = point2.y - point1.y;

        let cross = dxc * dyl - dyc * dxl;
        if (Math.abs(cross) > 0.00001)
            return false;

        if (Math.abs(dxl) >= Math.abs(dyl))
            return dxl > 0 ?
                point1.x <= currPoint.x && currPoint.x <= point2.x :
                point2.x <= currPoint.x && currPoint.x <= point1.x;
        else
            return dyl > 0 ?
                point1.y <= currPoint.y && currPoint.y <= point2.y :
                point2.y <= currPoint.y && currPoint.y <= point1.y;
    }

    public isBetweenExclusive(currPoint: Point): boolean {
        var point1 = this.p1;
        var point2 = this.p2;
        let dxc = currPoint.x - point1.x;
        let dyc = currPoint.y - point1.y;

        let dxl = point2.x - point1.x;
        let dyl = point2.y - point1.y;

        let cross = dxc * dyl - dyc * dxl;
        if (Math.abs(cross) > 0.00001)
            return false;

        const epsilon = 0.00001;

        if (Math.abs(dxl) >= Math.abs(dyl))
            return dxl > 0 ?
                point1.x < currPoint.x - epsilon && currPoint.x < point2.x - epsilon :
                point2.x < currPoint.x - epsilon && currPoint.x < point1.x - epsilon;
        else
            return dyl > 0 ?
                point1.y < currPoint.y - epsilon && currPoint.y < point2.y - epsilon :
                point2.y < currPoint.y - epsilon && currPoint.y < point1.y - epsilon;
    }

    public intersects(other: Line): boolean {
        const a = this.p1.x;
        const b = this.p1.y;
        const c = this.p2.x;
        const d = this.p2.y;
        const p = other.p1.x;
        const q = other.p1.y;
        const r = other.p2.x;
        const s = other.p2.y;
        var det: number, gamma: number, lambda: number;
        det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0) {
          return false;
        } else {
          lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
          gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
          return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    }
}
