import { Vector } from "../vector.js";

export class CollisionRect {
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(position = new Vector(0, 0), size = new Vector(0, 0)) {
        this.x = position.x;
        this.y = position.y;
        this.w = size.x;
        this.h = size.y;
    }

    collidingWith(coll: CollisionRect) {
        return (this.left <= coll.right &&
            coll.left <= this.right &&
            this.top <= coll.bottom &&
            coll.top <= this.bottom);
    }

    set position(pos) {
        this.x = pos.x;
        this.y = pos.y;
    }

    set size(area) {
        this.w = area.x;
        this.h = area.y;
    }

    get position() {
        return new Vector(this.x, this.y);
    }

    get size() {
        return new Vector(this.w, this.h);
    }

    get left() {
        return Math.min(this.x, this.x + this.w);
    }

    get right() {
        return Math.max(this.x, this.x + this.w);
    }

    get top() {
        return Math.min(this.y, this.y + this.h);
    }

    get bottom() {
        return Math.max(this.y, this.y + this.h);
    }
}
