import { approx, toDeg, wrapAngle } from "./Math";
import { Vec } from "./Vec";
import type { Point } from "./Vec";

const EPSILON = 0.00001;

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
        return approx(this.rotation, other.rotation, 0.0001) || approx(this.rotation, wrapAngle(other.rotation + 180), 0.0001);
    }

    public isBetween(currPoint: Point): boolean {
        var point1 = this.p1;
        var point2 = this.p2;
        let dxc = currPoint.x - point1.x;
        let dyc = currPoint.y - point1.y;

        let dxl = point2.x - point1.x;
        let dyl = point2.y - point1.y;

        let cross = dxc * dyl - dyc * dxl;
        if (Math.abs(cross) > EPSILON)
            return false;

        if (Math.abs(dxl) >= Math.abs(dyl))
            return dxl > 0 ?
                point1.x <= currPoint.x + EPSILON && currPoint.x <= point2.x + EPSILON :
                point2.x <= currPoint.x + EPSILON && currPoint.x <= point1.x + EPSILON;
        else
            return dyl > 0 ?
                point1.y <= currPoint.y + EPSILON && currPoint.y <= point2.y + EPSILON :
                point2.y <= currPoint.y + EPSILON && currPoint.y <= point1.y + EPSILON;
    }

    public isBetweenExclusive(currPoint: Point): boolean {
        var point1 = this.p1;
        var point2 = this.p2;
        let dxc = currPoint.x - point1.x;
        let dyc = currPoint.y - point1.y;

        let dxl = point2.x - point1.x;
        let dyl = point2.y - point1.y;

        let cross = dxc * dyl - dyc * dxl;
        if (Math.abs(cross) > EPSILON)
            return false;

        if (Math.abs(dxl) >= Math.abs(dyl))
            return dxl > 0 ?
                point1.x < currPoint.x - EPSILON && currPoint.x < point2.x - EPSILON :
                point2.x < currPoint.x - EPSILON && currPoint.x < point1.x - EPSILON;
        else
            return dyl > 0 ?
                point1.y < currPoint.y - EPSILON && currPoint.y < point2.y - EPSILON :
                point2.y < currPoint.y - EPSILON && currPoint.y < point1.y - EPSILON;
    }

    public intersects(other: Line): boolean {
        return doIntersect(this.p1, this.p2, other.p1, other.p2);
    }

    public distanceTo(point: Point): number {
        var dx = this.v1.x - this.v2.x;
        var dy = this.v1.y - this.v2.y;
        var l2 = dx * dx + dy * dy;

        if (l2 == 0)
            return this.v2.distance(point);

        var t = ((point.x - this.v2.x) * dx + (point.y - this.v2.y) * dy) / l2;
        t = Math.max(0, Math.min(1, t));

        return Vec.from(point).distance({ x: this.v2.x + t * dx, y: this.v2.y + t * dy });
    }
}

// Given three collinear points p, q, r, the function checks if
// point q lies on line segment 'pr'
function onSegment(p: Point, q: Point, r: Point): boolean {
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
        return true;

    return false;
}

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p: Point, q: Point, r: Point): number {

    // See https://www.geeksforgeeks.org/orientation-3-ordered-points/
    // for details of below formula.
    let val = (q.y - p.y) * (r.x - q.x) -
        (q.x - p.x) * (r.y - q.y);

    if (val == 0) return 0; // collinear

    return (val > 0) ? 1 : 2; // clock or counterclock wise
}

// The main function that returns true if line segment 'p1q1'
// and 'p2q2' intersect.
function doIntersect(p1: Point, q1: Point, p2: Point, q2: Point): boolean {

    // Find the four orientations needed for general and
    // special cases
    let o1 = orientation(p1, q1, p2);
    let o2 = orientation(p1, q1, q2);
    let o3 = orientation(p2, q2, p1);
    let o4 = orientation(p2, q2, q1);

    // General case
    if (o1 != o2 && o3 != o4)
        return true;

    // Special Cases
    // p1, q1 and p2 are collinear and p2 lies on segment p1q1
    if (o1 == 0 && onSegment(p1, p2, q1)) return true;

    // p1, q1 and q2 are collinear and q2 lies on segment p1q1
    if (o2 == 0 && onSegment(p1, q2, q1)) return true;

    // p2, q2 and p1 are collinear and p1 lies on segment p2q2
    if (o3 == 0 && onSegment(p2, p1, q2)) return true;

    // p2, q2 and q1 are collinear and q1 lies on segment p2q2
    if (o4 == 0 && onSegment(p2, q1, q2)) return true;

    return false; // Doesn't fall in any of the above cases
}