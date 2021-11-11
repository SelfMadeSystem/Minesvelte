import type { Point } from "./Vec";

export class Matrix2D {
    private callbacks: ((Matrix2D: Matrix2D) => void)[] = [];
    constructor(
        public a: number = 1,
        public b: number = 0,
        public c: number = 0,
        public d: number = 1,
        public tx: number = 0,
        public ty: number = 0
    ) { }

    subscribe(callback: (Matrix2D: Matrix2D) => void) {
        this.callbacks.push(callback);
        callback(this);
        return () => {
            this.callbacks = this.callbacks.filter(c => c !== callback);
        }
    }

    notify() {
        this.callbacks.forEach(c => c(this));
    }

    set(a: number, b: number, c: number, d: number, tx: number, ty: number) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        this.notify();
        return this;
    }

    copy(matrix: Matrix2D) {
        return this.set(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    }

    clone() {
        return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
    }

    identity() {
        return this.set(1, 0, 0, 1, 0, 0);
    }

    translate(x: number, y: number) {
        this.tx += x;
        this.ty += y;
        this.notify();
        return this;
    }

    scale(x: number, y: number) {
        this.a *= x;
        this.d *= y;
        this.c *= x;
        this.b *= y;
        this.tx *= x;
        this.ty *= y;
        this.notify();
        return this;
    }

    rotate(angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const a1 = this.a;
        const c1 = this.c;
        const tx1 = this.tx;

        this.a = a1 * cos - this.b * sin;
        this.b = a1 * sin + this.b * cos;
        this.c = c1 * cos - this.d * sin;
        this.d = c1 * sin + this.d * cos;
        this.tx = tx1 * cos - this.ty * sin;
        this.ty = tx1 * sin + this.ty * cos;
        this.notify();
        return this;
    }

    apply(pos: { x: number, y: number }) {
        return {
            x: this.a * pos.x + this.c * pos.y + this.tx,
            y: this.b * pos.x + this.d * pos.y + this.ty
        };
    }

    applyInverse(pos: { x: number, y: number }) {
        const id = 1 / (this.a * this.d + this.c * -this.b);
        return {
            x: (this.d * pos.x - this.c * pos.y + this.ty * this.c - this.tx * this.d) * id,
            y: (this.a * pos.y - this.b * pos.x + this.tx * this.b - this.ty * this.a) * id
        };
    }

    getTranslate(): Point {
        return {
            x: this.tx,
            y: this.ty
        };
    }

    getScale(): Point {
        return {
            x: Math.sqrt(this.a * this.a + this.b * this.b),
            y: Math.sqrt(this.c * this.c + this.d * this.d)
        };
    }

    getRotation() {
        return Math.atan2(this.b, this.a);
    }

    toCSS() {
        return `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.tx}, ${this.ty})`;
    }

    toString() {
        return `Matrix2D(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.tx}, ${this.ty})`;
    }

    static fromCSS(css: string) {
        const m = css.match(/matrix\((.*)\)/);
        if (!m) {
            throw new Error(`Invalid matrix string: ${css}`);
        }
        const values = m[1].split(',').map(v => parseFloat(v));
        if (values.length !== 6) {
            throw new Error(`Invalid matrix string: ${css}`);
        }
        return new Matrix2D(values[0], values[1], values[2], values[3], values[4], values[5]);
    }

    static fromArray(array: number[]) {
        return new Matrix2D(array[0], array[1], array[2], array[3], array[4], array[5]);
    }

    static fromObject(obj: { a: number, b: number, c: number, d: number, tx: number, ty: number }) {
        return new Matrix2D(obj.a, obj.b, obj.c, obj.d, obj.tx, obj.ty);
    }

    static identity() {
        return new Matrix2D(1, 0, 0, 1, 0, 0);
    }
}