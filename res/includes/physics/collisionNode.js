import { DivNode } from "../graphics/DivNode.js";
import { Vector } from "../vector.js";
import { CollisionRect } from "./collisionRect.js";
class CollisionNode extends DivNode {
    constructor(pos = new Vector(0, 0), area = new Vector(50, 50), tag = 'div', classes = ['gameComp']) {
        super(pos, area, tag, classes);
        this.masks = [];
        this.layers = [];
        this.colliders = [];
        this.rect = new CollisionRect(pos, area);
    }
    collEnter(data) {
        this.colliders.push(data['collider']);
    }
    collLeave(data) {
        let i = this.colliders.indexOf(data['collider']);
        if (i != -1)
            this.colliders.splice(i, 1);
    }
    initCollision() {
    }
    loop(delta) {
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
}
