export interface Point {
    x: number;
    y: number;
}

export class Vec implements Point {
    constructor(public readonly x = 0, public readonly y = 0) {
    }

    public static from({x, y}: Point): Vec {
        return new Vec(x, y);
    }

    public static fromAngle(rad: number): Vec {
        return new Vec(Math.cos(rad), Math.sin(rad));
    }

    public lengthSq(): number {
        return this.x * this.x + this.y * this.y;
    }

    public length(): number {
        return Math.sqrt(this.lengthSq());
    }

    public add(v: Vec): Vec {
        return new Vec(this.x + v.x, this.y + v.y);
    }

    public sub(v: Vec): Vec {
        return new Vec(this.x - v.x, this.y - v.y);
    }

    public mul(v: Vec): Vec {
        return new Vec(this.x * v.x, this.y * v.y);
    }

    public div(v: Vec): Vec {
        return new Vec(this.x / v.x, this.y / v.y);
    }

    public scale(s: number): Vec {
        return new Vec(this.x * s, this.y * s);
    }

    public normalize(): Vec {
        return this.scale(1 / this.length());
    }

    public dot(v: Vec): number {
        return this.x * v.x + this.y * v.y;
    }

    public angle(): number {
        return Math.atan2(this.y, this.x);
    }

    public rotate(rad: number): Vec {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        return new Vec(this.x * c - this.y * s, this.x * s + this.y * c);
    }

    public rotateAround(rad: number, v: Vec): Vec {
        return this.sub(v).rotate(rad).add(v);
    }

    public distanceSq(other: Vec): number {
        return this.sub(other).lengthSq();
    }

    public distance(other: Vec): number {
        return this.sub(other).length();
    }
}

export default Vec;