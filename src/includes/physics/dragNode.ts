import { DivNode } from "../graphics/DivNode.js";
import { Vector } from "../vector.js";

export class DragNode extends DivNode {
    beingDragged = false;
    dragId = 0;
    relPos: Vector;
    // document.addEventListener('touchstart', (e) => { touch.onTouchDown(e.changedTouches[0]) }, false);

    initTouch() {
        this.div.addEventListener('touchstart', (e) => { this.onTapDown(e.changedTouches)}, false);
        // this.div.addEventListener('mousedown', (e) => { this.onTapDown([this.engine.fakeTouchEvent(e)]) }, false);
        this.div.addEventListener('touchend', (e) => { this.onTapDown(e.changedTouches)}, false);
        this.div.addEventListener('mouseup', (e) => { ([this.engine.fakeTouchEvent(e)]) }, false);
    }

    onTapDown(e: TouchList) {
        for (let t of e) {
            if (t.target == this.div) {
                this.beingDragged = true;
                this.dragId = t.identifier;
                this.relPos = new Vector(t.pageX, t.pageY).subtract(this.pos);
            }
        }
    }

    onTapUp(e: TouchList) {
        for (let t of e) {
            if (t.target == this.div) {
                this.beingDragged = false;
            }
        }
    }

    onTapMove() {

    }

    constructor(pos: Vector, area = new Vector(50, 50), tag = 'div', classes: string[] = ['gameComp']) {
        super(pos, area, tag, classes);
    }
}