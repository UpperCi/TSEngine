// 2D coordinates
export class Vector {
    constructor(x, y) {
        this.x = 0;
        this.y = 0;
        if (typeof (x) == "string")
            x = parseFloat(x);
        if (typeof (y) == "string")
            y = parseFloat(y);
        this.x = x;
        this.y = y;
    }
    get length() {
        return Math.sqrt(Math.abs(this.x) + Math.abs(this.y));
    }
    distanceTo(v) {
        let diff = new Vector(v.x - this.x, v.y - this.y);
        return diff.length;
    }
    normalized() {
        let l = this.length;
        if (l === 0)
            return this;
        return new Vector(this.x / l, this.y / l);
    }
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    multiply(n) {
        return new Vector(this.x * n, this.y * n);
    }
}
