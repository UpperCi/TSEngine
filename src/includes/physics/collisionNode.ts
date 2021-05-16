import { Game } from "../../game.js";
import { BaseNode } from "../baseNode.js";
import { DivNode } from "../graphics/DivNode.js";
import { Vector } from "../vector.js";
import { CollisionRect } from "./collisionRect.js";

export class CollisionNode extends DivNode {
    rect: CollisionRect;
    masks: number[] = [0];
    layers: number[] = [0];
    colliders: number[] = [];
    collId: number;

    constructor(pos: Vector = new Vector(0,0), area = new Vector(50, 50), tag = 'div', classes: string[] = ['gameComp']) {
        super(pos, area, tag, classes);
        this.rect = new CollisionRect(pos, area);
    }

    collEnter(self: CollisionNode, data: Object) {
        self.colliders.push(data['collId']);
    }

    collLeave(self: CollisionNode, data: Object) {
        let i = self.colliders.indexOf(data['collId']);
        if (i != -1) self.colliders.splice(i, 1);
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
        this.customReady();
    }

    loop(delta: number) {
        this.delta = delta;

        for (let child of this.children) {
            child.loop(delta);
        }

        this.customUpdate(delta);
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
    collidingWith(coll: CollisionNode) {
        for (let l of coll.layers) {
            if (l in this.masks) {
                return this.rect.collidingWith(coll.rect);
            }
        }
        return false;
    }

    set game (engine: Game) {
        this.engine = engine;
        for (let child of this.children) {
            child.game = engine;
        }
        engine.addColl(this);
        this.input = engine.input;
    }

    set onCollEnter(callback: (self: BaseNode, data: Object) => void) {
        this.connect('collEnter', this, callback);
    }

    set onCollLeave(callback: (self: BaseNode, data: Object) => void) {
        this.connect('collLeave', this, callback);
    }
}
