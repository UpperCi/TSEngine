// 2D coordinates
export class Vector {
    public x: number = 0;
    public y: number = 0;

    constructor(x: number | string, y: number | string) {
        if (typeof (x) == "string") x = parseFloat(x);
        if (typeof (y) == "string") y = parseFloat(y);
        this.x = x;
        this.y = y;
    }

    public distanceTo(v: Vector): number {
        let diff = new Vector(v.x - this.x, v.y - this.y);
        return diff.length;
    }

    public normalized(): Vector {
        let l = this.length;
        if (l === 0) return this;
        return new Vector(this.x / l, this.y / l);
    }

    public add(v: Vector): Vector {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    public subtract(v: Vector): Vector {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    public multiply(n: number | Vector): Vector {
        if (typeof(n) == 'number') return new Vector(this.x * n, this.y * n);
        else return new Vector(this.x * n.x, this.y * n.y);
    }

    public pow(n: number) {
        return new Vector(this.x ** n, this.y ** n);
    }

    public get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
