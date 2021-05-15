// 2D coordinates
export class Vector {
    x: number = 0;
    y: number = 0;

    constructor(x: number | string, y: number | string) {
        if (typeof (x) == "string") x = parseFloat(x);
        if (typeof (y) == "string") y = parseFloat(y);
        this.x = x;
        this.y = y;
    }

    get length(): number {
        return Math.sqrt(Math.abs(this.x) + Math.abs(this.y));
    }

    distanceTo(v: Vector): number {
        let diff = new Vector(v.x - this.x, v.y - this.y);
        return diff.length;
    }

    normalized(): Vector {
        let l = this.length;
        if (l === 0) return this;
        return new Vector(this.x / l, this.y / l);
    }

    add(v: Vector): Vector {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    subtract(v: Vector): Vector {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    multiply(n: number): Vector {
        return new Vector(this.x * n, this.y * n);
    }
}
