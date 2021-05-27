import { Vector } from "../vector.js";

export class CollisionRect {
    public x: number;
    public y: number;
    public w: number;
    public h: number;

    constructor(position = new Vector(0, 0), size = new Vector(0, 0)) {
        this.x = position.x;
        this.y = position.y;
        this.w = size.x;
        this.h = size.y;
    }

    public collidingWith(coll: CollisionRect) {
        return (this.left <= coll.right &&
            coll.left <= this.right &&
            this.top <= coll.bottom &&
            coll.top <= this.bottom);
    }

    public set position(pos) {
        this.x = pos.x;
        this.y = pos.y;
    }

    public set size(area) {
        this.w = area.x;
        this.h = area.y;
    }

    public get position() {
        return new Vector(this.x, this.y);
    }

    public get size() {
        return new Vector(this.w, this.h);
    }

    public get left() {
        return Math.min(this.x, this.x + this.w);
    }

    public get right() {
        return Math.max(this.x, this.x + this.w);
    }

    public get top() {
        return Math.min(this.y, this.y + this.h);
    }

    public get bottom() {
        return Math.max(this.y, this.y + this.h);
    }
}
