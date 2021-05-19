import { DivNode } from "../graphics/DivNode.js";
import { Vector } from "../vector.js";
import { CollisionRect } from "./collisionRect.js";
export class CollisionNode extends DivNode {
    constructor(pos = new Vector(0, 0), area = new Vector(50, 50), tag = 'div', classes = ['gameComp']) {
        super(pos, area, tag, classes);
        this.masks = [0];
        this.layers = [0];
        this.colliders = [];
        this.rect = new CollisionRect(pos, area);
    }
    collEnter(self, data) {
        self.colliders.push(data['collId']);
    }
    collLeave(self, data) {
        let i = self.colliders.indexOf(data['collId']);
        if (i != -1)
            self.colliders.splice(i, 1);
    }
    initCollision() {
        this.connect('collEnter', this, this.collEnter);
        this.connect('collLeave', this, this.collLeave);
    }
    start() {
        this.div = this.engine.updateEl(new Vector(0, 0), new Vector(0, 0), this.div);
        for (let child of this.children) {
            child.start();
        }
        this.initCollision();
        this.customReady(this);
    }
    loop(delta) {
        this.delta = delta;
        for (let child of this.children) {
            child.loop(delta);
        }
        this.customUpdate(this, delta);
        this.updateElement();
    }
    updateRect() {
        this.rect.position = this.position;
        this.rect.size = this.area;
    }
    updateElement() {
        this.div = this.engine.updateEl(this.position, this.area, this.div);
        this.updateRect();
    }
    // checks if any mask / layer combo matches up, else auto returns false
    collidingWith(coll) {
        for (let l of coll.layers) {
            if (l in this.masks) {
                return this.rect.collidingWith(coll.rect);
            }
        }
        return false;
    }
    set game(engine) {
        this.engine = engine;
        for (let child of this.children) {
            child.game = engine;
        }
        engine.addColl(this);
        this.input = engine.input;
        this.touch = engine.touch;
    }
    set onCollEnter(callback) {
        this.connect('collEnter', this, callback);
    }
    set onCollLeave(callback) {
        this.connect('collLeave', this, callback);
    }
}
